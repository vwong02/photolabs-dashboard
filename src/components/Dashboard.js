import React, { Component } from "react"
import Loading from "./Loading"
import Panel from "./Panel"
import classnames from "classnames"

const data = [
	{
		id: 1,
		label: "Total Photos",
		value: 10,
	},
	{
		id: 2,
		label: "Total Topics",
		value: 4,
	},
	{
		id: 3,
		label: "User with the most uploads",
		value: "Allison Saeng",
	},
	{
		id: 4,
		label: "User with the least uploads",
		value: "Lukas Souza",
	},
]

class Dashboard extends Component {
	state = { loading: false }

	// Saves to local storage, on refresh will remember the focus state
	componentDidMount() {
		const focused = JSON.parse(localStorage.getItem("focused"))
		if (focused) {
			this.setState({ focused })
		}
	}

	componentDidUpdate(previousProps, previousState) {
		if (previousState.focused !== this.state.focused) {
			localStorage.setItem("focused", JSON.stringify(this.state.focused))
		}
	}

	// Has to be arrow function to handle `this` otherwise it won't work
	selectPanel(id) {
		this.setState((previousState) => ({
			focused: previousState.focused !== null ? null : id,
		}))
	}

	render() {
		const dashboardClasses = classnames("dashboard", {
			"dashboard--focused": this.state.focused,
		})

		if (this.state.loading) {
			return <Loading />
		}

		const panels = (
			this.state.focused
				? data.filter((panel) => this.state.focused === panel.id)
				: data
		).map((panel) => (
			<Panel
				key={panel.id}
				label={panel.label}
				value={panel.value}
				onSelect={(event) => this.selectPanel(panel.id)}
			/>
		))

		return <main className={dashboardClasses}>{panels}</main>
	}
}

export default Dashboard
