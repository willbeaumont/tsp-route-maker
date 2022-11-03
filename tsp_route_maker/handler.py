import json

from tsp import TravelingSalesProblem
from logger import Logger

logger = Logger(__name__).get_logger()

def lambda_handler(event, context):
    logger.info("Reading event addresses")
    try:
        addresses = event["addresses"]
    except Exception as e:
        return {
            'statusCode': 400,
            'body': json.dumps(repr(e))
        }
    
    logger.info("Running tsp")
    try:
        tsp = TravelingSalesProblem(addresses)
    except Exception as e:
        return {
            'statusCode': 400,
            'body': json.dumps(repr(e))
        }
    
    return {
        'statusCode': 200,
        'body': json.dumps(tsp.maps_url())
    }
