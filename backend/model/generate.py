from transformers import pipeline, set_seed

set_seed(42)


class LLM_generate:

    def __init__(self):
        self.generator = pipeline('text-generation', model='gpt2')
    
    def generate(self, prompt: str) -> str:
        """
        generate cover letter
        """
        prompt = "given this information " + prompt + ". A Cover Letter for this person's job application should be"
        return self.generator(prompt, return_full_text=False, num_return_sequences=5)