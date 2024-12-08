import numpy as np

class RLModel:
    def __init__(self, num_states, num_actions, alpha=0.1, gamma=0.9, epsilon=0.2):
        self.q_table = np.zeros((num_states, num_actions))
        self.alpha = alpha  # Learning rate
        self.gamma = gamma  # Discount factor
        self.epsilon = epsilon  # Exploration rate
        self.cache = {}  # Caching for state-action pairs

    def choose_action(self, state):
        """
        Chooses an action based on epsilon-greedy policy.
        """
        if state in self.cache:
            return self.cache[state]  # Return cached result
        if np.random.rand() < self.epsilon:
            action = np.random.choice(range(self.q_table.shape[1]))  # Explore
        else:
            action = np.argmax(self.q_table[state])  # Exploit
        self.cache[state] = action
        return action

    def update_q_value(self, state, action, reward, next_state):
        """
        Updates the Q-value for a given state-action pair using the Bellman equation.
        """
        best_next_action = np.argmax(self.q_table[next_state])
        td_target = reward + self.gamma * self.q_table[next_state, best_next_action]
        td_error = td_target - self.q_table[state, action]
        self.q_table[state, action] += self.alpha * td_error
        self.cache[state] = action
