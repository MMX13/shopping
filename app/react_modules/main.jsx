import React from 'react';
import ReactDOM from 'react-dom';
import ItemsPage from './items'
import RecipesPage from './meals'

class Layout extends React.Component {
	render() {
		return (<div>
			<Header />
			<Body />
		</div>)
	}
}

class Header extends React.Component {
	render() {
		return <h1>Shopping App</h1>
	}
}

class Body extends React.Component {
	constructor(props) {
		super(props);
		this.state = {"location": "home"}
	}

	updateLocation(location){
		this.setState({"location": location})
	}

	prepareBody(){
		if(this.state.location=="items"){
			return <ItemsPage />
		}else if(this.state.location=="meals"){
			return <RecipesPage />
		}else{
			return <HomePage />
		}
	}

	render() {
		return (
			<div>
				<Navbar updateLocation={this.updateLocation.bind(this)}/>
				{this.prepareBody()}
			</div>)
	}

}

var Navbar = (props) => {
	return (<div>
		<a onClick={() => props.updateLocation('home')}>Home</a>
		<a onClick={() => props.updateLocation('items')}>Items</a>
		<a onClick={() => props.updateLocation('meals')}>Meals</a>
		</div>)
}

var HomePage = () => {
	return <h1>This is the home page</h1>
}



ReactDOM.render(<Layout />, document.getElementById('root'))