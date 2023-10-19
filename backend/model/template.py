from model import LLM

class LLM_template(LLM):
    
    def text_to_prompt(cv_text, job_des_text)->str:
        """
        from cv_text and job des,
        create a prompt using template
        """    
        return cv_text + job_des_text
    
    def generate(self, cv_text: str, job_des_text:str) -> str:
        prompt = self.text_to_prompt(cv_text, job_des_text)
        return super().generate(prompt)

