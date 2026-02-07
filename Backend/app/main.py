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
    # Verifica se a sala ainda existe antes de tentar enviar
    if room_code in rooms:
        for ws in rooms[room_code]["players"]:
            await ws.send_json(message)


def draw_characters(room):
    available = [
        c for c in CHARACTERS
        if c not in room["used_characters"]
    ]

    # SE NÃO TIVER MAIS PARES DISPONÍVEIS, RETORNA NONE
    # (Removemos a parte que limpava a lista automaticamente)
    if len(available) < 2:
        return None

    chosen = random.sample(available, 2)
    room["used_characters"].extend(chosen)

    return chosen


@app.websocket("/ws/{room_code}")
async def websocket_endpoint(ws: WebSocket, room_code: str):
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

    await broadcast(room_code, {
        "event": "player_joined",
        "players": len(room["players"])
    })

    try:
        while True:
            data = await ws.receive_json()
            event = data.get("event")

            # Lógica unificada para start e restart
            if event == "start_game" or event == "restart_game":
                
                # Se for start_game (primeira vez), garante que a lista está limpa
                if event == "start_game":
                    room["used_characters"] = []

                chars = draw_characters(room)

                # SE CHARS FOR NONE, O JOGO ACABOU
                if chars is None:
                    await broadcast(room_code, {
                        "event": "game_over",
                        "message": "Todos os personagens foram usados!"
                    })
                else:
                    # Segue o jogo normal
                    room["characters"] = {
                        0: chars[0],
                        1: chars[1]
                    }
                    
                    # Define qual evento enviar de volta
                    response_event = "game_started" if event == "start_game" else "game_restarted"

                    for idx, player_ws in enumerate(room["players"]):
                        await player_ws.send_json({
                            "event": response_event,
                            "character": room["characters"][idx]
                        })

    except WebSocketDisconnect:
        if room_code in rooms:
            if ws in room["players"]:
                room["players"].remove(ws)

            if room["players"]:
                await broadcast(room_code, {
                    "event": "player_left"
                })
            else:
                del rooms[room_code]