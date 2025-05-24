class LlmTemplates:
    """
    This class contains templates for various tasks.
    """

    def __init__(self):
        self.templates = {
            "summarize": {
                "prompt": "Summarize the following text:\n\n{input}",
                "output": "Summary: {output}",
            },
            "translate": {
                "prompt": "Translate the following text to {language}:\n\n{input}",
                "output": "Translation: {output}",
            },
            "classify": {
                "prompt": "Classify the following text into one of the categories: {categories}\n\n{input}",
                "output": "Classification: {output}",
            },
            "Ia_gestor": {
                "prompt": "You are a personal trainer. Answer the following question:\n\n{input}",
                "output": "Answer: {output}",
            },
            "SqL_ia":{
                "prompt": "You are a SQL expert. Answer the following question with the following database: \n\n{input}",
                "output": "Answer: {output}",
            },
            'Ia_trainer':{
                "prompt": "You are a personal trainer. Answer the following question:\n\n{input}",
                "output": "Answer: {output}",
            }
        }