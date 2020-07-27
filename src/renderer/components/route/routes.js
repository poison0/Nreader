import landingPage from "../../newPage/index/LandingPage"


const routes = [
    {
        path: '/newPage',
        name: 'newPage',
        redirect: landingPage
    }
    // {
    //     path: '*', redirect: '/'
    // }
];

export default routes;