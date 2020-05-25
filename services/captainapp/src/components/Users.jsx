import React, { useEffect, useState, Fragment, useCallback } from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import "../assets/styles/users.css";
import { variables } from "../config";
import { toast } from "react-toastify";
import { connect } from "react-redux";

const Users = ({ adminDetails }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [usersCollection, setUsersCollection] = useState([]);

	const fetchUsers = useCallback(async () => {
		try {
			const users = (await axios.get(`${variables.baseUrl}/auth/admin?page=1&limit=1000`)).data;
			if (users.status) {
				setUsersCollection(users.data.result);
			} else {
				throw new Error(users.data);
			}
		} catch (error) {
			toast.error(error.toString());
		}
		isLoading && setIsLoading(false);
	}, [isLoading]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const deleteUserHandler = async (userId) => {
		try {
			const delUser = (await axios.delete(`${variables.baseUrl}/auth/admin/${userId}`)).data
			if (delUser.status) {
				await fetchUsers();
				toast.success(delUser.data);
			} else {
				throw new Error(delUser.data);
			}
		} catch (error) {
			toast.error(error.toString());
		}
	}

	const onChangeAdmin = async (accessLevel, userId) => {
		try {
			const body = {};
			body.userId = userId;
			body.adminStatus = false;
			body.accessLevel = null;
			if (accessLevel !== "None") {
				body.adminStatus = true;
				body.accessLevel = accessLevel;
			}
			const adminAccess = (await axios.put(`${variables.baseUrl}/auth/admin`, body)).data;
			if (adminAccess.status) {
				await fetchUsers();
			} else {
				throw new Error(adminAccess.data);
			}
		} catch (error) {
			toast.error(error.toString());
		}
	};

	return (
		<div className="users-wrapper">
			<div className="users-header">
				<div className="user-indicator d-flex align-items-center font-weight-bold base-color h5-responsive">
					<i className="fas fa-angle-right mr-1 right-angel"></i>Users
				</div>
			</div>
			<div className="users-container">
				{isLoading ? (
					<div className="loader-center">
						<Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
					</div>
				) : (
						usersCollection.map((item, index) => (
							<div className={`user-display-holder ${adminDetails.accessLevel === 3 ? "access-level-added" : ''}`} key={index}>
								{
									adminDetails.accessLevel === 3 && (
										<div className="user-btn-rounded user-delete-button cursor-pointer" onClick={e => deleteUserHandler(item._id)}>
											<i className="far fa-trash-alt"></i>
										</div>
									)
								}
								<div className="user-rounded-circle-holder" style={{ backgroundImage: `url(${item.avatar})` }}>
								</div>
								<div className="user-name">{item.name}</div>
								<div className="user-description">{`${item.email}`}</div>
								<div className="user-description">{`Joined At ${new Date(item.date).toDateString()}`}</div>
								{
									adminDetails.accessLevel === 3 && (
										<Fragment>
											<div className="access-levels">Admin Access</div>
											<select
												value={!item.admin.accessLevel ? "None" : item.admin.accessLevel}
												onChange={e => onChangeAdmin(e.target.value, item._id)}
												className="access-level"
											>
												<option value="None">Non-admin</option>
												<option value="1">Access Level 1</option>
												<option value="2">Access Level 2</option>
												<option value="3">Access Level 3</option>
											</select>
										</Fragment>
									)
								}
							</div>
						))
					)}
			</div>
		</div >
	);
};

const mapStateToProps = state => ({ adminDetails: state.auth.adminDetails });

export default connect(mapStateToProps, null)(Users);
