import plotly.express as px

def visualise_match_scores(matches):
    """
    Creates a bar chart visualisation of top engineers for each task based on match scores.
    """
    top_matches = matches.groupby("task_id").apply(
        lambda x: x.nlargest(5, "match_score")
    ).reset_index(drop=True)

    fig = px.bar(
        top_matches,
        x="engineer_id",
        y="match_score",
        color="task_id",
        title="Top Engineer Matches by Task",
        labels={"engineer_id": "Engineer ID", "match_score": "Match Score"},
    )
    fig.show()
