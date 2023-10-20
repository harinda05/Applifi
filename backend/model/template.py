from transformers import pipeline, set_seed

set_seed(42)

    
class LLM_template:

    def __init__(self):
        self.generator = pipeline('text-generation', model='gpt2')
    
    def text_to_prompt(self, cv_text, job_des_text)->str:
        """
        from cv_text and job des,
        create a prompt for LLM_template
        """    
        return cv_text + job_des_text
    
    def generate(self, cv_text: str, job_des_text:str) -> str:
        """
        generate a prompt using template
        """
        prompt = self.text_to_prompt(cv_text, job_des_text)
        return self.generator(prompt,  num_return_sequences=1, return_full_text=False)[0]['generated_text']