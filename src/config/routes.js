/* eslint-disable react/jsx-key */
import AuthorizedRoute from 'base-shell/lib/components/AuthorizedRoute/AuthorizedRoute'
import React, { lazy } from 'react'
import { Route } from 'react-router-dom'


const BASEPATH = '/livebox'

const About = lazy(() => import('../pages/About'))
const Admin = lazy(() => import('../pages/Demo/Admin'))
const Companies = lazy(() => import('../pages/Demo/Companies'))
const Company = lazy(() => import('../pages/Demo/Companies/Company'))
const Tasks = lazy(() => import('../pages/Demo/Tasks'))
const Task = lazy(() => import('../pages/Demo/Tasks/Task'))
const FirebaseCols = lazy(() => import('../pages/Firebase/Cols'))
const FirebaseDocs = lazy(() => import('../pages/Firebase/Docs'))
const FirebaseLists = lazy(() => import('../pages/Firebase/Lists'))
const FirebaseMessaging = lazy(() => import('../pages/Firebase/Messaging'))
const FirebasePaths = lazy(() => import('../pages/Firebase/Paths'))
const FirebaseStorage = lazy(() => import('../pages/Firebase/Storage'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Posts = lazy(() => import('../pages/Demo/Posts/Posts'))
const Search = lazy(() => import('../pages/Search'))
const Post = lazy(() => import('../pages/Demo/Posts/Post'))
const GettingStarted = lazy(() =>
  import('../pages/Documentation/GettingStarted')
)

const routes = [
  <Route path={`${BASEPATH}/about`} exact component={About} />,
  <Route path={`${BASEPATH}/docu/getting_started`} exact component={GettingStarted} />,
  <Route path={`${BASEPATH}/search`} exact component={Search} />,
  <AuthorizedRoute path={`${BASEPATH}/dashboard`} exact component={Dashboard} />,
  <AuthorizedRoute path={`${BASEPATH}/firebase_paths`} exact component={FirebasePaths} />,
  <AuthorizedRoute path={`${BASEPATH}/firebase_lists`} exact component={FirebaseLists} />,
  <AuthorizedRoute path={`${BASEPATH}/firebase_docs`} exact component={FirebaseDocs} />,
  <AuthorizedRoute path={`${BASEPATH}/firebase_cols`} exact component={FirebaseCols} />,
  <AuthorizedRoute path={`${BASEPATH}/admin`} exact component={Admin} />,
  <AuthorizedRoute path={`${BASEPATH}/companies`} exact component={Companies} />,
  <AuthorizedRoute path={`${BASEPATH}/companies/:uid`} exact component={Company} />,
  <AuthorizedRoute path={`${BASEPATH}/create_company`} exact component={Company} />,
  <AuthorizedRoute path={`${BASEPATH}/tasks`} exact component={Tasks} />,
  <AuthorizedRoute path={`${BASEPATH}/tasks/:uid`} exact component={Task} />,
  <AuthorizedRoute path={`${BASEPATH}/create_task`} exact component={Task} />,
  <AuthorizedRoute path={`${BASEPATH}/posts`} exact component={Posts} />,
  <AuthorizedRoute path={`${BASEPATH}/create_post`} exact component={Post} />,
  <AuthorizedRoute
    path="/firebase_messaging"
    exact
    component={FirebaseMessaging}
  />,
  <AuthorizedRoute
    path="/firebase_storage"
    exact
    component={FirebaseStorage}
  />,
]

export default routes
