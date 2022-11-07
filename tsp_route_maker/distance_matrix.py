import urllib.parse

import requests

from get_secret import get_secret
from logger import Logger

logger = Logger(__name__).get_logger()

class DistanceMatrix:
    def __init__(self, addresses, is_distance_type):
        logger.info("Initializing DistanceMatrix")
        self.addresses = self.clean(addresses)
        self.api_key = get_secret()
        self.is_distance_type = is_distance_type
    
    @staticmethod
    def clean(dirty_addresses):
        """Delete ',', replace spaces with '+', and encode special characters"""
        return [urllib.parse.quote_plus(a.replace(",", "")) for a in dirty_addresses]

    def create(self):
        logger.info("Creating distance matrix")
        # Distance Matrix API only accepts 100 elements per request, so get rows in multiple requests.
        max_elements = 100
        num_addresses = len(self.addresses) # 16 in this example.
        # Maximum number of rows that can be computed per request
        max_rows = max_elements // num_addresses
        # num_addresses = q * max_rows + r
        q, r = divmod(num_addresses, max_rows)
        dest_addresses = self.addresses
        distance_matrix = []
        no_data_rows = []
        # Send q requests, returning max_rows rows per request.
        for i in range(q):
            origin_addresses = self.addresses[i * max_rows: (i + 1) * max_rows]
            response = self.send_request(origin_addresses, dest_addresses)
            matrix_part, bad_rows = self.build_matrix(response)
            distance_matrix += matrix_part
            no_data_rows += bad_rows

        # Get the remaining remaining r rows, if necessary.
        if r > 0:
            origin_addresses = self.addresses[q * max_rows: q * max_rows + r]
            response = self.send_request(origin_addresses, dest_addresses)
            matrix_part, bad_rows = self.build_matrix(response)
            distance_matrix += matrix_part
            no_data_rows += bad_rows
        return distance_matrix, no_data_rows

    def send_request(self, origin_addresses, dest_addresses):
        """ Build and send request for the given origin and destination addresses."""
        logger.info("Sending API request")
        def build_address_str(addresses):
            # Build a pipe-separated string of addresses
            address_str = ''
            for i in range(len(addresses) - 1):
                address_str += addresses[i] + '|'
            address_str += addresses[-1]
            return address_str

        request = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial'
        origin_address_str = build_address_str(origin_addresses)
        dest_address_str = build_address_str(dest_addresses)
        request += '&origins=' + origin_address_str + '&destinations=' + dest_address_str + '&key=' + self.api_key
        
        try:
            res = requests.get(request)
            response = res.json()
        except Exception as e:
            logger.error(f"Requests failed: {e}")
            raise e

        return response

    def build_matrix(self, response):
        logger.info("Building matrix from request response")
        matrix_type = 'distance' if self.is_distance_type else 'duration'
        
        matrix = []
        bad_row = []
        for row_index, row in enumerate(response['rows']):
            row_list = [row['elements'][j][matrix_type]['value'] for j in range(len(row['elements'])) if row['elements'][j]['status']=='OK']
            if len(row_list) == 0:
                bad_row.append(row_index)
            else:
                matrix.append(row_list)
        return matrix, bad_row
