import React from 'react'
import axios from 'axios';

export default class ItemsPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {items:[]}
	}
	componentDidMount() {
		axios.get('/api/items')
			.then((response) => {
				this.setState({items:response.data})
			})
	}
	addItem(item){
		axios.post('/api/items', {
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

export class ItemInput extends React.Component {
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