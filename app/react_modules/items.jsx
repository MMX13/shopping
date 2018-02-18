import React from 'react'
import axios from 'axios';

export default class ItemsPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {items:[], item:null}
	}
	componentDidMount() {
		axios.get('/api/items')
			.then((response) => {
				this.setState({items:response.data})
			})
	}
	addItem(item){
		axios.post('/api/items', item)
			.then((res)=>{
				axios.get('/api/items')
					.then((res)=>{
						this.setState({items: res.data,
									   item: null})
					})
			})
	}

	modifyItem(item){
		this.setState({"item":item})
		this.forceUpdate()
	}

	render() {
		return (<div>
			<ItemList items={this.state.items} modifyItem={this.modifyItem.bind(this)} />
			<ItemInput addItem={this.addItem.bind(this)} item={this.state.item} />
			</div>);
	}
}

var ItemList = (props) => {
	var rows = []
	props.items.forEach((item)=>{
		rows.push(<tr key={item.name}><td>{item.name}</td>
									  <td>{item.category}</td>
									  <td>{item.unit}</td>
									  <td><a onClick={()=>props.modifyItem(item)}>Modify</a></td>
									  <td><a>Delete</a></td></tr>)
	})
	return (<table>
		<thead><tr>
			<td>Item</td>
			<td>Category</td>
			<td>Unit</td>
			<td colSpan="2"></td>
		</tr></thead>
		<tbody>{rows}</tbody>
		</table>);
}

export class ItemInput extends React.Component {
	constructor(props) {
		super(props);
		if(props.item){
			this.state=props.item
		} else {
			this.state={name:"",category:""}
		}
	}
	componentWillReceiveProps(props){
		if(props.item){
			this.setState(props.item)
			this.setState({"unit": "Units"})
		} else {
			this.setState({name:"", category: ""})
		}
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
				<select id="unit" value={this.state.value} onChange={this.handleChange.bind(this)}>
					<option value="Units">Units</option>
					<option value="gm">Grams</option>
					<option value="ml">Millilitres</option>
					<option value="tsp">Teaspoon</option>
					<option value="tbsp">Tablespoon</option>
				</select>
				<button onClick={this.submitInput.bind(this)}>Submit</button>
			</div>
			)
	}
}