"""Simple Traveling Salesperson Problem (TSP) between cities."""
import urllib.parse

from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

from distance_matrix import DistanceMatrix
from logger import Logger

logger = Logger(__name__).get_logger()


class TravelingSalesProblem:
    def __init__(self, addresses):
        logger.info("Initializing TravelingSalesProblem")
        self.addresses = addresses
        self.distance_matrix, self.bad_addresses = DistanceMatrix(
            addresses=addresses, is_distance_type=True
        ).create()
        logger.info(f"Length of distance matrix: {len(self.distance_matrix)}")
        self.num_vehicles = 1
        self.depot = 0
        self.manager = self.get_manager()
        self.routing = self.get_routing()
        self.solution = self.solve()

    def map_urls(self):
        """Returns URL of the shortest route AND embed url - should probably separate"""
        logger.info("Building solution url")
        url = "https://www.google.com/maps/dir"
        embed = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyA7NhfpbJTBbS-cHNW78HgBZvqiGBKCqWY"
        index = self.routing.Start(0)
        route_addresses = [
            a for i, a in enumerate(self.addresses) if i not in self.bad_addresses
        ]
        origin = urllib.parse.quote(route_addresses[index])
        first_index = True
        waypoints = []
        while not self.routing.IsEnd(index):
            stopover = urllib.parse.quote(route_addresses[index])
            url += f"/{stopover}"
            if not first_index:
                waypoints.append(stopover)
            else:
                first_index = False
            index = self.solution.Value(self.routing.NextVar(index))
        embed += f"&mode=walking&origin={origin}&destination={origin}&waypoints={'|'.join(waypoints)}"
        return f"{url}/{origin}", embed

    def get_manager(self):
        logger.info("Getting manager")
        # Create the routing index manager.
        return pywrapcp.RoutingIndexManager(
            len(self.distance_matrix), self.num_vehicles, self.depot
        )

    def get_routing(self):
        # Create Routing Model.
        logger.info("Getting routing")
        routing = pywrapcp.RoutingModel(self.manager)

        def distance_callback(from_index, to_index):
            """Returns the distance between the two nodes."""
            # Convert from routing variable Index to distance matrix NodeIndex.
            from_node = self.manager.IndexToNode(from_index)
            to_node = self.manager.IndexToNode(to_index)
            return self.distance_matrix[from_node][to_node]

        transit_callback_index = routing.RegisterTransitCallback(distance_callback)

        # Define cost of each arc.
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        return routing

    def define_search_parameters(self):
        logger.info("Defining search params")
        # Setting first solution heuristic.
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        search_parameters.time_limit.seconds = 30
        search_parameters.log_search = True

        return search_parameters

    def solve(self):
        logger.info("Solving")
        # Solve the problem.
        search_parameters = self.define_search_parameters()
        return self.routing.SolveWithParameters(search_parameters)
