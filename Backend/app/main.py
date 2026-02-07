import random
import string
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

# Personagens disponíveis
CHARACTERS = [
    "Hello Kitty", "Mimmy", "Dear Daniel", "My Melody",
    "Kuromi", "Cinnamoroll", "Pompompurin", "Badtz-Maru",
    "Keroppi", "Chococat", "Pochacco", "Tuxedosam",
    "Hangyodon", "Gudetama", "Aggretsuko", "Kiki",
    "Lala", "Pekkle", "Wish Me Mell", "Bonbonribbon",
    "Cogimyun", "Ruby", "Shirousa", "Kurousa"
]

rooms = {}


def generate_room_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


@app.post("/room")
def create_room():
    code = generate_room_code()

    rooms[code] = {
        "players": [],
        "used_characters": [],
        "characters": {}
    }

    return {"roomCode": code}


async def broadcast(room_code, message):
    for ws in rooms[room_code]["players"]:
        await ws.send_json(message)


def draw_characters(room):
    available = [
        c for c in CHARACTERS
        if c not in room["used_characters"]
    ]

    if len(available) < 2:
        room["used_characters"] = []
        available = CHARACTERS.copy()

    chosen = random.sample(available, 2)

    room["used_characters"].extend(chosen)

    return chosen


@app.websocket("/ws/{room_code}")
async def websocket_endpoint(ws: WebSocket, room_code: str):
    print("deu")
    await ws.accept()

    if room_code not in rooms:
        await ws.close()
        return

    room = rooms[room_code]

    if len(room["players"]) >= 2:
        await ws.send_json({"event": "room_full"})
        await ws.close()
        return

    room["players"].append(ws)
    player_index = len(room["players"]) - 1

    await broadcast(room_code, {
        "event": "player_joined",
        "players": len(room["players"])
    })

    try:
        while True:
            data = await ws.receive_json()

            event = data.get("event")

            # iniciar partida
            if event == "start_game":
                chars = draw_characters(room)

                room["characters"] = {
                    0: chars[0],
                    1: chars[1]
                }

                for idx, player_ws in enumerate(room["players"]):
                    await player_ws.send_json({
                        "event": "game_started",
                        "character": room["characters"][idx]
                    })

            # reiniciar partida
            if event == "restart_game":
                chars = draw_characters(room)

                room["characters"] = {
                    0: chars[0],
                    1: chars[1]
                }

                for idx, player_ws in enumerate(room["players"]):
                    await player_ws.send_json({
                        "event": "game_restarted",
                        "character": room["characters"][idx]
                    })

    except WebSocketDisconnect:
        room["players"].remove(ws)

        if room["players"]:
            await broadcast(room_code, {
                "event": "player_left"
            })
        #else:
            #del rooms[room_code]
