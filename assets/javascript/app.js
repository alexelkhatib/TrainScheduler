//set firebase
var config = {
    apiKey: "AIzaSyAwgu5I79yCCe8yNUMsOa7btaA_UuOXBC0",
    authDomain: "train-scheduler-d5fdb.firebaseapp.com",
    databaseURL: "https://train-scheduler-d5fdb.firebaseio.com",
    projectId: "train-scheduler-d5fdb",
    storageBucket: "train-scheduler-d5fdb.appspot.com",
    messagingSenderId: "992936416653"
};
firebase.initializeApp(config);
var trainDB = firebase
    .database()
    .ref('trains');

//populates the table once the form is filled out and the repopulates on reload
function displayTable() {
    trainDB
        .on('child_added', function (snapshot) {
            //set the nestArrival and Minutes Away time values
            var startTime = snapshot
                .val()
                .startTime
                .split(':');
            startTime = moment()
                .hours(startTime[0])
                .minutes(startTime[1]);
            var diffTime = moment().diff(startTime, 'minutes');
            var remainingTime = diffTime % (snapshot.val().frequency);
            var minutesToTrain = snapshot
                .val()
                .frequency - remainingTime;
            var nextTrain = moment().add(minutesToTrain, 'minutes');
            nextTrain = moment(nextTrain).format("hh:mm A");
            //create the elements
            var tableRow = document.createElement("tr");
            var nameCell = document.createElement("td");
            var destinationCell = document.createElement("td");
            var frequencyCell = document.createElement("td");
            var nextTrainCell = document.createElement("td");
            var minutesToTrainCell = document.createElement("td");

            //set the textContent
            nameCell.textContent = snapshot
                .val()
                .trainName;
            destinationCell.textContent = snapshot
                .val()
                .destination;
            frequencyCell.textContent = snapshot
                .val()
                .frequency;
            nextTrainCell.textContent = nextTrain;
            minutesToTrainCell.textContent = minutesToTrain;

            //append values to tableRow
            tableRow.appendChild(nameCell);
            tableRow.appendChild(destinationCell);
            tableRow.appendChild(frequencyCell);
            tableRow.appendChild(nextTrainCell);
            tableRow.appendChild(minutesToTrainCell);

            //append tableRow to trainTable
            document
                .getElementById('trainTable')
                .appendChild(tableRow);

        })
}
displayTable();

//make the listener function
document
    .getElementById('trainForm')
    .addEventListener('submit', function (e) {
        //prevents the page from reloading on submit
        e.preventDefault();
        //check to see if it's working
        console.log('This is working!');
        //grab the form values

        var trainName = getInputVal('train-name');
        var destination = getInputVal('destination');
        var timeInput = getInputVal('train-time')
        var startTime = moment(timeInput, "HH:mm").format("HH:mm");
        var frequency = parseInt(getInputVal('frequency'));
        // passes the variables to firebase
        saveTrain(trainName, destination, frequency, startTime);
        document
            .getElementById('trainForm')
            .reset();

    });

function saveTrain(trainName, destination, frequency, startTime) {
    var newTrain = trainDB.push();
    newTrain.set({ trainName: trainName, destination: destination, frequency: frequency, startTime: startTime })
}
//short code for the input values
function getInputVal(id) {
    return document
        .getElementById(id)
        .value;
}