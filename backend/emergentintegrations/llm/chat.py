class UserMessage:
    def __init__(self, content):
        self.content = content


class LlmChat:
    def __init__(self, *args, **kwargs):
        pass

    async def chat(self, messages):
        return "Mock response from LlmChat"