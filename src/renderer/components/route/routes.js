import Reader from "@/components/reader/reader";
import MainPage from '@/components/index/mainPage'

const routes = [
    {
        path: '/',
        name: 'mainPage',
        component: MainPage
    },
    {
        path: '/reader',
        name: 'reader',
        component: Reader
    }
];

export default routes;