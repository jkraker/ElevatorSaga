function
{
    init: function(elevators, floors) { 
        var master_up_queue = []
        var master_down_queue = []
        
        for(i = 0; i < elevators.length; i++){
            init_elevator(elevators[i])
        }
        
        for(i = 0; i < floors.length; i++) {
            init_floor(floors[i]);
        }
        
        
        function init_elevator(new_elevator) {
            new_elevator.on("idle", function() {
                if(master_up_queue.length > 0) {
                    master_up_queue.sort()
                    new_elevator.goToFloor(master_up_queue.shift());
                } else if(master_down_queue.length > 0) {
                    master_down_queue.sort()
                    master_down_queue.reverse()
                    new_elevator.goToFloor(master_down_queue.shift());
                }
                
            });

            new_elevator.on("floor_button_pressed", function(floorNum) {
                // add floors selected within elevator to the queue
                new_elevator.goToFloor(floorNum);
            });

            new_elevator.on("passing_floor", function(floorNum, direction) {
                if(direction == "up") {
                    new_elevator.destinationQueue = 
                        combine_lists_no_dups(new_elevator.destinationQueue,
                                              grab_floors_up_floors_above(floorNum));
                    // sort queued floors are in ascending order and make the
                    // next floor first in the queue
                    new_elevator.destinationQueue.sort();
                    while(new_elevator.destinationQueue[0] < floorNum) {
                        var item = new_elevator.destinationQueue.shift();
                        new_elevator.destinationQueue.push(item);
                    }
                    new_elevator.checkDestinationQueue();
                } else if(direction == "down") {
                    new_elevator.destinationQueue = 
                        combine_lists_no_dups(new_elevator.destinationQueue,
                                              grab_floors_down_floors_below(floorNum));
                    // sort queued floors are in descending order and make the
                    // next floor first in the queue
                    new_elevator.destinationQueue.sort()
                    new_elevator.destinationQueue.reverse()
                    while(new_elevator.destinationQueue[0] > floorNum) {
                        var item = new_elevator.destinationQueue.shift();
                        new_elevator.destinationQueue.push(item);
                    }
                    new_elevator.checkDestinationQueue();
                }
            });

            // haven't done anything here yet...
            new_elevator.goingUpIndicator(true);
            new_elevator.goingDownIndicator(true);
        }
        
        
        function init_floor(new_floor) {
            // if up button is pressed on a floor and that floor is
            // not in queue, add to the queue
            new_floor.on("up_button_pressed", function(floor) {
                if(floor_exists_in_list(floor.floorNum(), master_up_queue) == false) {
                    master_up_queue.push(floor.floorNum());
                }
            });

            // if down button is pressed on a floor and that floor is
            // not in queue, add to the queue
            new_floor.on("down_button_pressed", function(floor) {
                if(floor_exists_in_list(floor.floorNum(), master_down_queue) == false) {
                    master_down_queue.push(floor.floorNum());
                }
            });
        }
    
        
        function floor_exists_in_list(floor_number, list_of_floors) {
            for(this_floor in list_of_floors) {
                if(this_floor == floor_number) {
                    return true;
                }
            }
            return false;
        }
        
        
        function grab_floors_up_floors_above(floor_number) {
            var floor_list = []
            master_up_queue.sort()
            var index = master_up_queue.indexOf(floor_number);
            floor_list = floor_list.concat(master_up_queue.slice(index));
            for(item in floor_list) {
                master_up_queue.pop();
            }
            return floor_list;
        }
        
        
        function grab_floors_down_floors_below(floor_number) {
            var floor_list = []
            master_down_queue.sort()
            master_down_queue.reverse()
            var index = master_down_queue.indexOf(floor_number);
            floor_list = floor_list.concat(master_down_queue.slice(index));
            for(item in floor_list) {
                master_down_queue.pop();
            }
            return floor_list;
        }
        
        
        function combine_lists_no_dups(list_1, list_2) {
            var combined_list = list_1;
            for(item in list_2) {
                if(combined_list.indexOf(item) == -1) {
                    combined_list.push(item);
                }
            }
            return combined_list;
        }
    
        
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
