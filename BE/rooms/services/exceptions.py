class RoomError(Exception):

    def __init__(self, message="Error with RoomManager operation"):
        self.message = message
        super().__init__(self.message)
