import logging


class Logger:
    def __init__(self, class_name) -> None:
        self._class_name = class_name

    def get_logger(self):
        logger = self.set_up_logger(self._class_name)
        return logger

    @staticmethod
    def set_up_logger(class_name):
        logger = logging.getLogger(class_name)
        logger.setLevel(logging.DEBUG)

        logging.getLogger().handlers = []

        # create console handler
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)

        # create formatter
        formatter = logging.Formatter("%(asctime)s: [%(levelname)s] %(name)s: %(message)s", "%Y-%m-%d %H:%M:%S")

        ch.setFormatter(formatter)
        logger.addHandler(ch)

        return logger
