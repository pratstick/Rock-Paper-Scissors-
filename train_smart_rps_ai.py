import tensorflow as tf
import numpy as np
import random
import tensorflowjs as tfjs

moves = ['rock', 'paper', 'scissors']
move_to_idx = {'rock': 0, 'paper': 1, 'scissors': 2}
idx_to_move = {0: 'rock', 1: 'paper', 2: 'scissors'}

# One-hot encoder
def one_hot(index):
    vec = [0] * 3
    vec[index] = 1
    return vec

# Simulated smart human behavior
def simulate_round(history):
    if len(history) < 2:
        return random.randint(0, 2)

    last = history[-1]
    second_last = history[-2]

    # Pattern: Alternating
    if last == 0 and second_last == 1:
        return 0  # rock, paper → maybe back to rock
    if last == 1 and second_last == 0:
        return 1  # paper, rock → maybe back to paper

    # Pattern: Repeat 2x then switch
    if len(history) >= 3 and history[-1] == history[-2] == history[-3]:
        return (history[-1] + 1) % 3  # switch to next move

    # Pattern: Beat what beat me last
    return (last + 1) % 3 if random.random() < 0.5 else last

# Build dataset
X = []
y = []

sequence_length = 10  # 10-move memory
total_sequences = 5000

for _ in range(total_sequences):
    hist = [random.randint(0, 2)]  # start random

    for i in range(sequence_length + 1):
        move = simulate_round(hist)
        hist.append(move)

    input_seq = [one_hot(i) for i in hist[:sequence_length]]
    target = hist[sequence_length]

    X.append(input_seq)
    y.append(one_hot(target))

X = np.array(X)
y = np.array(y)

print("🧪 Dataset shape:", X.shape, y.shape)

# Build 1D CNN model
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(sequence_length, 3)),
    tf.keras.layers.Conv1D(64, kernel_size=3, activation='relu'),
    tf.keras.layers.GlobalMaxPooling1D(),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(3, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(X, y, epochs=40, batch_size=32, verbose=1)

# Export to TensorFlow.js
tfjs.converters.save_keras_model(model, 'model')
print("✅ Model exported to ./model (model.json + weights)")
