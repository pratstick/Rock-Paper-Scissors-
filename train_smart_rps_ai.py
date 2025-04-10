import tensorflow as tf
import numpy as np
import random
import tensorflowjs as tfjs

moves = ['rock', 'paper', 'scissors']
move_map = {'rock': [1, 0, 0], 'paper': [0, 1, 0], 'scissors': [0, 0, 1]}

def beats(move):
    return {'rock': 'paper', 'paper': 'scissors', 'scissors': 'rock'}[move]

X = []
y = []

def simulate_game_sequence():
    history = []
    for _ in range(100):
        # player strategy: random + pattern + tilt
        if len(history) >= 3 and random.random() < 0.4:
            prev_moves = [m[0] for m in history[-3:]]
            if prev_moves[0] == prev_moves[1] == prev_moves[2]:
                next_move = beats(prev_moves[0])  # breaks repeat
            else:
                next_move = prev_moves[-1]  # repeat last
        else:
            next_move = random.choice(moves)

        # computer randomly responds (placeholder)
        comp_move = random.choice(moves)

        history.append((next_move, comp_move))

        if len(history) >= 5:
            # input: 5 rounds of human+computer encoded
            feature = []
            for past_h, past_c in history[-5:]:
                feature.extend(move_map[past_h])
                feature.extend(move_map[past_c])
            X.append(feature)
            y.append(move_map[next_move])  # predict player's next move
    return history

# Generate multiple sequences
for _ in range(400):
    simulate_game_sequence()

X = np.array(X)
y = np.array(y)

model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(30,)),  # 5 rounds * (3+3)
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(3, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(X, y, epochs=60, batch_size=32, verbose=1)

# Export for browser
tfjs.converters.save_keras_model(model, 'model')
print("✅ Smart model exported to ./model (model.json + weights)")
