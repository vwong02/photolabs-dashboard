import React, { Component } from "react"
import classnames from "classnames"
import Loading from "./Loading"
import Panel from "./Panel"
import {
	getTotalPhotos,
	getTotalTopics,
	getUserWithMostUploads,
	getUserWithLeastUploads,
} from "helpers/selectors"

const data = [
	{
		id: 1,
		label: "Total Photos",
		getValue: getTotalPhotos,
	},
	{
		id: 2,
		label: "Total Topics",
		getValue: getTotalTopics,
	},
	{
		id: 3,
		label: "User with the most uploads",
		getValue: getUserWithMostUploads,
	},
	{
		id: 4,
		label: "User with the least uploads",
		getValue: getUserWithLeastUploads,
	},
]

class Dashboard extends Component {
	state = {
		loading: true,
		focused: null,
		photos: [],
		topics: [],
	}

	// Saves to local storage, on refresh will remember the focus state
	componentDidMount() {
		const focused = JSON.parse(localStorage.getItem("focused"))
		if (focused) {
			this.setState({ focused })
		}
		const urlsPromise = ["/api/photos", "/api/topics"].map((url) =>
			fetch(url).then((response) => response.json())
		)
		Promise.all(urlsPromise).then(([photos, topics]) => {
			this.setState({
				loading: false,
				photos: photos,
				topics: topics,
			})
		})
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
				value={panel.getValue(this.state)}
				onSelect={() => this.selectPanel(panel.id)}
			/>
		))

		return <main className={dashboardClasses}>{panels}</main>
	}
}

export default Dashboard
