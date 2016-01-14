function
{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function() {
            elevator.goToFloor(0);
        });
        
        elevator.on("floor_button_pressed", function(floorNum) {
            // add floors selected within elevator to the queue
            elevator.goToFloor(floorNum);
        });
        
        elevator.on("passing_floor", function(floorNum, direction) {
            if(direction == "up") {
                // sort queued floors are in ascending order and make the
                // next floor first in the queue
                elevator.destinationQueue.sort();
                while(elevator.destinationQueue[0] < floorNum) {
                    var item = elevator.destinationQueue.shift();
                    elevator.destinationQueue.push(item);
                }
                elevator.checkDestinationQueue();
            } else if(direction == "down") {
                // sort queued floors are in descending order and make the
                // next floor first in the queue
                elevator.destinationQueue.sort()
                elevator.destinationQueue.reverse()
                while(elevator.destinationQueue[0] > floorNum) {
                    var item = elevator.destinationQueue.shift();
                    elevator.destinationQueue.push(item);
                }
                elevator.checkDestinationQueue();
            }
        });
        
        for(i = 0; i < floors.length; i++) {
            // if up button is pressed on a floor and that floor is
            // not in queue, add to the queue
            floors[i].on("up_button_pressed", function(floor) {
                if(floor_exists_in_list(floor.floorNum(), elevator.destinationQueue) == false) {
                    elevator.destinationQueue.push(floor.floorNum());
                }
            });
        }

        for(i = 0; i < floors.length; i++) {
            // if down button is pressed on a floor and that floor is
            // not in queue, add to the queue
            floors[i].on("down_button_pressed", function(floor) {
                if(floor_exists_in_list(floor.floorNum(), elevator.destinationQueue) == false) {
                    elevator.destinationQueue.push(floor.floorNum());
                }
            });
        }
        
        // haven't done anything with these yet...
        elevator.goingUpIndicator(true);
        elevator.goingDownIndicator(true);
        
        function floor_exists_in_list(floor_number, list_of_floors) {
            for(floor in list_of_floors) {
                if(floor == floor_number) {
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
