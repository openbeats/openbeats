import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import "../assets/styles/users.css";
import { variables } from "../config";

const Users = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [usersCollection, setUsersCollection] = useState([]);
	useEffect(() => {
		fetchUsers();
	}, []);
	const fetchUsers = async () => {
		const users = (await axios.get(`${variables.baseUrl}/auth/admin`)).data;
		if (users.status) {
			setUsersCollection(users.data.result);
		}
		isLoading && setIsLoading(false);
	};
	return (
		<div className="users-wrapper">
			<div className="users-header">
				<div className="user-indicator d-flex align-items-center font-weight-bold base-color h5-responsive">
					<i className="fas fa-angle-right mr-1 right-angel"></i>Artists
				</div>
				<div className="user-search-input">
					<input className="input input-sm red-border" type="text" placeholder="Search Albums, Artists, Languages..." aria-label="Search" />
					<i className="fas fa-search text-grey cursor-pointer" aria-hidden="true"></i>
				</div>
			</div>
			<div className="users-container">
				{isLoading ? (
					<div className="width-100 height-100 d-flex align-items-center justify-content-center">
						<Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
					</div>
				) : (
					usersCollection.map((item, index) => (
						<div className="user-display-holder cursor-pointer" key={index}>
							<div className="user-rounded-circle-holder" style={{ backgroundImage: `url(${item.avatar})` }}></div>
							<div className="user-name">{item.name}</div>
							<div className="user-description">{`Joined At ${new Date(item.date).toDateString()}`}</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Users;
