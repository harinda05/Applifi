from transformers import AutoTokenizer, AutoModel

class LLM:
    def __init__(self, model: AutoModel, tokenizer: AutoTokenizer):
        self.model = model
        self.tokenizer = tokenizer
        
    def text_to_prompt(self, text:str) -> str:
        raise NotImplementedError
    
    def decode(self, model_output:dict) -> str:
        raise NotImplementedError
        
    def generate(self, text: str) -> str:
        prompt = self.text_to_prompt(text)
        tokens = self.tokenizer(prompt)
        model_output = self.model(tokens)
        return self.decode(model_output)