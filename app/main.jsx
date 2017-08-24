import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

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
		</div>)
}

var HomePage = () => {
	return <h1>This is the home page</h1>
}

class ItemsPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {items:[]}
	}
	componentDidMount() {
		axios.get('/api/item')
			.then((response) => {
				this.setState({items:response.data})
			})
	}
	addItem(item){
		axios.post('/api/item', {
			name: item.name,
			category: item.category
		}).then((res)=>{
			this.setState((state)=>{
				return state.items.push(item)
			})
		})
	}

	render() {
		return (<div>
			<ItemList items={this.state.items} />
			<ItemInput addItem={this.addItem.bind(this)}/>
			</div>);
	}
}

var ItemList = (props) => {
	var rows = []
	props.items.forEach((item)=>{
		rows.push(<tr key={item.name}><td>{item.name}</td><td>{item.category}</td></tr>)
	})
	return (<table>
		<thead><tr><td>Item</td><td>Category</td></tr></thead>
		<tbody>{rows}</tbody>
		</table>);
}

// class ItemList extends React.Component {
// 	render(){
// 		var rows = []
// 		this.props.items.forEach((item)=>{
// 			rows.push(<tr key={item.name}><td>{item.name}</td><td>{item.category}</td></tr>)
// 		})
// 		return (<table>
// 			<thead><tr><td>Item</td><td>Category</td></tr></thead>
// 			<tbody>{rows}</tbody>
// 			</table>);

// 	}

// }

class ItemInput extends React.Component {
	constructor(props) {
		super(props);
		this.state={name:"",category:""}
	}
	handleChange(e){
		this.setState({[e.target.id]: e.target.value})
	}
	submitInput(){
		this.props.addItem(this.state)
	}
	render(){
		return (		
			<div>
				<input id="name" value={this.state.name} onChange={this.handleChange.bind(this)}/>
				<input id="category" value={this.state.category} onChange={this.handleChange.bind(this)}/>
				<button onClick={this.submitInput.bind(this)}>Submit</button>
			</div>
			)
	}
}

ReactDOM.render(<Layout />, document.getElementById('root'))