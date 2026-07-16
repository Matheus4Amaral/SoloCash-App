import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
    },
    chartArea: {
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    legendArea: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    legendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 10,
    },
    label: {
        fontSize: 12,
        color: '#4A5568',
        fontWeight: '600',
    },
    value: {
        fontSize: 12,
        color: '#1A202C',
        fontWeight: '700',
        marginTop: 2,
    },
    percent: {
        fontSize: 12,
        color: '#4A5568',
        fontWeight: '600',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
    },
});