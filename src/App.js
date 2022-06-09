import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

const etherUnit = 'ether';
let manager = '';
let accounts = [];

class App extends Component {
    async componentWillMount() {
        if (lottery === undefined || web3 === undefined) {
            return;
        }
        manager = await lottery.methods.manager().call();
        accounts = await web3.eth.getAccounts();
    }

    state = {
        manager: '',
        players: [],
        balance: '',
        value: '',
        message: ''
    }

    async componentDidMount() {
        document.title = 'Lottery application';
        if (web3 === undefined) {
            return;
        }
        
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        this.setState({
            manager: manager,
            players: players,
            balance: balance,
            value: '',
            message: ''
        });
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({message: 'Waiting on transaction success...'});
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, etherUnit)
            });
            const players = await lottery.methods.getPlayers.call();
            const balance = await web3.eth.getBalance(lottery.options.address);
            this.setState({
                manager: manager,
                players: players,
                balance: balance,
                value: '',
                message: 'You have been entered!'
            });
        } catch (error) {
            this.setState({message: 'The transaction couldnot complete successfully'});
            console.log(error);
        }   
    }

    onClick = async () => {
        this.setState({message: 'Waiting on transaction success...'});
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[0]
            });
            this.setState({
                manager: manager,
                players: [],
                balance: '0',
                value: '',
                message: 'A winner has been picked!'
            });
        } catch (error) {
            this.setState({message: 'The transaction couldnot complete successfully'});
            console.log(error);
        }
        
    }

    handleNoMetamask() {
        setTimeout(function(){
            var win = window.open('http://metamask.io/', '_blank');
            if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
            //Browser has blocked it
            alert('Please allow popups for this website');
            }
        }, 5000);
    }

    render() {
        if (web3 === undefined) {
            this.handleNoMetamask();
            return (
                <div className="App"> 
                    <h1>Please install and login metamask then reloading this page</h1>      
                </div>
            );
        }
        return (
            <div className="App">
                <h2>Lottery contract</h2>
                <p>This contract is managed by {this.state.manager}.</p>
                <p>There are currently {this.state.players.length} people (person)
         entered competing to win {web3.utils.fromWei(this.state.balance, etherUnit)} ether</p>
                <hr/>
                <form onSubmit={this.onSubmit}>
                    <h4>Want to try your luck ?</h4>
                    <div>
                        <label>Amount of ether to enter</label>
                        <input value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                        />
                    </div>
                    <button>Sign me up!</button>
                </form>
                <hr/>
                <h4>{this.state.message}</h4>
                <ManagerView isManager={accounts[0] === manager}/>
            </div>
        );
    }
}

class ManagerView extends React.Component {
    render() {
        if (this.props.isManager) {
            return (
                <div>
                    <h4>Let's pick a winner</h4>
                    <button onClick={this.onClick}>Pick a Winner</button>
                </div>
            );
        }
        return (
        <div></div>
        )
    }
}

export default App;
