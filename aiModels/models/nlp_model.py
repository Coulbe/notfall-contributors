
from sklearn.feature_extraction.text import TfidfVectorizer

def train_nlp_model(texts, num_topics=5):
    """
    Train an NLP model to cluster similar tasks.

    Parameters:
        texts (list[str]): List of task descriptions.
        num_topics (int): Number of topics to extract.

    Returns:
        LatentDirichletAllocation: Trained LDA model for topic modeling.
    """
    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        X = vectorizer.fit_transform(texts)

        lda_model = LatentDirichletAllocation(n_components=num_topics, random_state=42)
        lda_model.fit(X)
        return lda_model, vectorizer
    except Exception as e:
        print(f"Error training NLP model: {e}")
        return None, None
