import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    container: {
        padding: 2,
        marginLeft: 20,
    },
    buttonitem: {
        margin: 10,
        padding: 10,
    },
    inputset: {
        textAlign: 'left',
        padding: 10,
        margin: 10,
    },
    inputitem: {
        textAlign: 'left',
        padding: 5,
        margin: 5,
    },
    right: {
        float: 'right',
    },
    label: {
        marginRight: 10,
    },
}))

export default useStyles
