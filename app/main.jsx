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
	constructor() {
		super()
		this.state = {items:[{name:"mince"}, {name:"chicken"}]}
	}
	componentDidMount() {
		axios.get('/api/item')
			.then(function(response){
				this.state = {items:response}
			})
	}
	addItem(item){
		this.setState((state)=>{
			return state.items.push(item)
		})
	}

	render() {
		return (<div>
			<ItemList items={this.state.items} />
			<ItemInput addItem={this.addItem.bind(this)}/>
			</div>);
	}
}

class ItemList extends React.Component {
	render(){
		var rows = []
		this.props.items.forEach((item)=>{
			rows.push(<tr key={item.name}><td>{item.name}</td><td>{item.category}</td></tr>)
		})
		return (<table>
			<thead><td>Item</td><td>Category</td></thead>
			<tbody>{rows}</tbody>
			</table>);

	}

}

class ItemInput extends React.Component {
	constructor(props) {
		super(props);
		this.state={name:"",category:""}
	}
	handleChange(e){
		this.setState({[e.target.id]: e.target.value})
	}
	submitInput(){
		this.props.addItem(this.state
)	}
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