function
{
    init: function(elevators, floors) {
        
        var master_queue = []
        
        for(i = 0; i < elevators.length; i++){
            init_elevator(elevators[i])
        }
        
        for(i = 0; i < floors.length; i++) {
            init_floor(floors[i]);
        }
        
        function init_elevator(new_elevator) {
            new_elevator.on("idle", function() {
                if(master_queue.length == 0) return;
                var destination = master_queue.shift()
                new_elevator.goToFloor(destination);
            });

            new_elevator.on("floor_button_pressed", function(floorNum) {
                // add floors selected within elevator to the queue
                new_elevator.goToFloor(floorNum);
            });

            new_elevator.on("passing_floor", function(floorNum, direction) {
                if(direction == "up") {
                    // sort queued floors are in ascending order and make the
                    // next floor first in the queue
                    new_elevator.destinationQueue.sort();
                    while(new_elevator.destinationQueue[0] < floorNum) {
                        var item = new_elevator.destinationQueue.shift();
                        new_elevator.destinationQueue.push(item);
                    }
                    new_elevator.checkDestinationQueue();
                } else if(direction == "down") {
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
                if(floor_exists_in_list(floor.floorNum(), elevator.destinationQueue) == false) {
                    master_queue.push(floor.floorNum());
                }
            });

            // if down button is pressed on a floor and that floor is
            // not in queue, add to the queue
            new_floor.on("down_button_pressed", function(floor) {
                if(floor_exists_in_list(floor.floorNum(), elevator.destinationQueue) == false) {
                    master_queue.push(floor.floorNum());
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
    },
    
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
