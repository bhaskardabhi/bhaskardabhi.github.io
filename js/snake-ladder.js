Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        var that = this;
        return Array(Math.ceil(that.length/chunkSize)).fill().map(function(_,i){
            return that.slice(i*chunkSize,i*chunkSize+chunkSize);
        });
    }
});
Vue.component('board-cell', {
    props: ['number','color','players'],
    template: `<span v-bind:class="[color, \'board-cell\',{active: players.length > 0}]">
        <board-player :player="player" v-for="(player, index) in players"></board-player>
        {{number}}
    </span>`
});
Vue.component('board-player', {
    props: ['player'],
    template: '<span class="board-player" :title="player.name"><i class="fa fa-user" aria-hidden="true"></i> {{player.number}}</span>'
});
Vue.component('board-score', {
    props: ['players','currentPlayer'],
    template: `
    <table class="table table-condensed">
        <thead>
            <tr>
                <th>Player</th>
                <th>Position</th>
            </tr>
        </thead>
        <tbody>
            <tr v-bind:class="[{success: player.position== 100},{info: currentPlayer && player.number == currentPlayer.number}]" v-for="player in players">
                <td>{{ player.name }}</td>
                <td>{{ player.position }}</td>
            </tr>
        </tbody>
    </table>`
});
Vue.component('board-dice', {
    props: ['number'],
    template: `<div class="text-center"><div v-bind:class="[\'dice\']">
        <div>
            <span><i v-if="[2,3,4,5,6].indexOf(number) > -1" class="fa fa-circle" aria-hidden="true"></i></span>
            <span><i v-if="[].indexOf(number) > -1" class="fa fa-circle" aria-hidden="true"></i></span>
            <span><i v-if="[4,5,6].indexOf(number) > -1" class="fa fa-circle" aria-hidden="true"></i></span>
        </div>
        <div>
            <span><i v-if="[6].indexOf(number) > -1" class="fa fa-circle" aria-hidden="true"></i></span>
            <span><i v-if="[1,3,5].indexOf(number) > -1" class="fa fa-circle" aria-hidden="true"></i></span>
            <span><i v-if="[6].indexOf(number) > -1" class="fa fa-circle" aria-hidden="true"></i></span>
        </div>
        <div>
            <span><i v-if="[4,5,6].indexOf(number) > -1" class="fa fa-circle" aria-hidden="true"></i></span>
            <span><i v-if="[].indexOf(number) > -1" class="fa fa-circle" aria-hidden="true"></i></span>
            <span><i v-if="[2,3,4,5,6].indexOf(number) > -1" class="fa fa-circle" aria-hidden="true"></i></span>
        </div>
    </div></div>`
});
Vue.component('board-elements', {
    props: ['snakes','ladders'],
    template: `
    <div class="row">
        <div class="col-md-6">
            <h4>Snakes</h4>
            <table class="table table-condensed">
                <thead>
                    <tr>
                        <th>Head</th>
                        <th>Tail</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="snake in snakes">
                        <td>{{ snake.end }}</td>
                        <td>{{ snake.start }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col-md-6">
            <h4>Ladders</h4>
            <table class="table table-condensed">
                <thead>
                    <tr>
                        <th>Top</th>
                        <th>Bottom</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ladder in ladders">
                        <td>{{ ladder.end }}</td>
                        <td>{{ ladder.start }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`
});
Vue.component('board-messages', {
    props: ['messages'],
    computed: {
        reversedMessages: function () {
            return this.messages.sort(function (a,b) {
                return (b.index - a.index);
            });
        }
    },
    template: `
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">Messages</h3>
        </div>
        <div class="panel-body">
            <p class="text-center" v-if="messages.length == 0">No messages yet</p>
            <ul style="height: 200px;overflow: scroll;">
                <li v-for="message in reversedMessages">{{ message.message }}</li>
            </ul>
        </div>
    </div>`
});
Vue.component('board', {
    props: ['players'],
    data: function () {
        return {
            diceNumber: 1,
            currentPlayer: null,
            cells: [],
            ladders: [],
            snakes: [],
            messages: [],
            gameStarted: false
        }
    },
    template: `<div class='board'>
        <p class="alert alert-primary" v-if="isGameEnded()">Winner: {{currentPlayer.name}}</p>
        <h3 v-if="currentPlayer && !isGameEnded()">Current Player: {{currentPlayer.name}} ({{currentPlayer.position}})</h3>
        <div class="row">
            <div class="col-md-8">
                <board-cell :players="cellPlayers(n,players)" :number="n" :color="n % 2 == 0 ? 'white':'black'" v-for="(n,index) in cells"></board-cell>
            </div>
            <div class="col-md-4">
                <div class="row">
                    <div class="col-md-6">
                        <board-score :players="players" :currentPlayer="currentPlayer"></board-score>
                    </div>
                    <div class="col-md-6">
                        <board-dice @click.native="rollDice" :number="diceNumber"></board-dice>
                        <p v-if="!gameStarted">Click on dice (^) to start</p>
                    </div>
                </div>
                <board-elements :snakes="snakes" :ladders="ladders"></board-elements>
                <board-messages :messages="messages"></board-messages>
            </div>
        </div>
    </div>`,
    methods: {
        cellPlayers: function (cellNumber,players) {
            return players.filter(function (player) {
                return player.position == cellNumber;
            });
        },
        rollDice: function () {
            if(!this.gameStarted){
                this.gameStarted = true;
            }
            if(this.isGameEnded()){
                return true;
            }
            
            this.rollDiceForPlayer(this.currentPlayer);
        },
        getNextDiceNumber: function () {
            var items = [
                1,1,1,1,1,1,
                2,2,2,2,2,
                3,3,3,3,
                4,4,4,
                5,5,
                6
            ];
            
            return items[Math.floor(Math.random()*items.length)];
        },
        getRandomCellNumber: function (max,min) {
            var max = max ? max : 99, min = min ? min : 2;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        getNextPlayer: function (currentPlayer) {
            var nextPlayer = this.players.find(function (player) {
                return !currentPlayer || player.number > currentPlayer.number;
            });
            
            if(!nextPlayer){
                nextPlayer = this.getNextPlayer(nextPlayer);
            }
            
            return nextPlayer;
        },
        nextTurn(){
            this.currentPlayer = this.getNextPlayer(this.currentPlayer);
        },
        movePlayerToCell: function (player,cellNumber) {
            player.position = cellNumber > 100 ? 100 : cellNumber;
            player.moves.push(player.position);
            
            this.addMessage(player.name+" reached "+player.position);
            
            if(player.position == 100){
                this.addMessage(player.name+" Won");
            }
            
            var ladder = this.checkIfLadderExistOnCell(player.position);
            
            if(ladder){
                this.addMessage(player.name+" got Ladder at "+player.position+" and reached "+ladder.end);
                this.movePlayerToCell(player,ladder.end);
                return true;
            }
            
            var snake = this.checkIfSnakeExistOnCell(player.position);
            
            if(snake){
                this.addMessage("Snake bit "+player.name+" at "+player.position+" and reached "+snake.start);
                this.movePlayerToCell(player,snake.start);
            }
        },
        addMessage: function (message) {
            this.messages.push({
                message: message,
                index: this.messages.length + 1
            });
        },
        rollDiceForPlayer(player){
            this.diceNumber = this.getNextDiceNumber();
            
            this.movePlayerToCell(player,player.position + this.diceNumber);
            
            if(this.isGameEnded()){
                return true;
            }
            
            if(this.diceNumber != 6){
                this.nextTurn();
            } else {
                this.addMessage(player.name+" got 6. Turn again");
            }
        },
        isGameEnded: function () {
            return this.players.filter(function (player) {
                return player.position >= 100;
            }).length > 0;
        },
        initializeLadders: function () {
            var totalElements = 5;
            for (var i = 0; i < totalElements; i++) {
                this.ladders.push(this.getRandomBoardElement());
            }
        },
        getRandomBoardElement: function () {
            var min = this.getRandomCellNumber(89),
                max = this.getRandomCellNumber(null,min+11);
                
            return {start: min, end: max};
        },
        initializeSnakes: function () {
            var totalElements = 5;
            for (var i = 0; i < totalElements; i++) {
                this.snakes.push(this.getRandomBoardElement());
            }
        },
        initializeCells: function () {
            // Cells in Board will be like following
            // 100 99 98 97 ...
            // 80 81 82 83 ...
            // ..
            // ..
            // 20 19 18 17
            // 1 2 3 4 5 ...
            for (var i = 10; i >= 1; i--) {
                var startPoint = (i%2 == 0) ? i*10: i*10-9,
                    endPoint = (i%2 == 0) ? i*10-9:i*10;

                if(startPoint < endPoint){
                    for (var j = startPoint; j <= endPoint; j++) {
                        this.cells.push(j);
                    }
                } else {
                    for (var j = startPoint; j >= endPoint; j--) {
                        this.cells.push(j);
                    }
                }
            }
        },
        checkIfLadderExistOnCell: function(number){
            return this.ladders.find(function (ladder) {
                return ladder.start == number;
            });
        },
        checkIfSnakeExistOnCell: function(number){
            return this.snakes.find(function (snake) {
                return snake.end == number;
            });
        }
    },
    created: function () {
        this.initializeCells();
        this.initializeLadders();
        this.initializeSnakes();

        this.nextTurn();
    }
});
var app = new Vue({ 
    el: '#gameboard',
    data: {
        players: [
            {
                number: 1,
                name: 'Player 1',
                position: 1,
                moves: []
            },{
                number: 2,
                name: 'Player 2',
                position: 1,
                moves: []
            }
        ]
    }
});