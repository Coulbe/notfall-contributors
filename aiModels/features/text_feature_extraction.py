import re
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from textblob import TextBlob
from sklearn.decomposition import LatentDirichletAllocation

def clean_text(text):
    """
    Preprocess and clean the input text by removing special characters and extra spaces.

    Parameters:
        text (str): Input text.

    Returns:
        str: Cleaned text.
    """
    text = text.lower()  # Convert to lowercase
    text = re.sub(r"[^\w\s]", "", text)  # Remove special characters
    text = re.sub(r"\s+", " ", text)  # Remove extra spaces
    return text.strip()

def analyze_sentiment(text):
    """
    Analyze the sentiment of a text.

    Parameters:
        text (str): Input text.

    Returns:
        str: Sentiment classification ("positive", "neutral", "negative").
    """
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0:
        return "positive"
    elif polarity == 0:
        return "neutral"
    else:
        return "negative"

def extract_topics(texts, num_topics=5, num_words=5):
    """
    Perform topic modeling on a list of texts.

    Parameters:
        texts (list[str]): List of input texts.
        num_topics (int): Number of topics to extract.
        num_words (int): Number of words per topic.

    Returns:
        list[dict]: List of topics with top words.
    """
    vectorizer = CountVectorizer(stop_words="english")
    X = vectorizer.fit_transform(texts)

    lda = LatentDirichletAllocation(n_components=num_topics, random_state=42)
    lda.fit(X)

    words = vectorizer.get_feature_names_out()
    topics = []

    for topic_idx, topic in enumerate(lda.components_):
        topics.append({
            "topic": topic_idx,
            "words": [words[i] for i in topic.argsort()[:-num_words - 1:-1]]
        })

    return topics
