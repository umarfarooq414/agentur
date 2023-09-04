export const errorParser = (err: any) => {
        if (err.response) return err.response.data
        if (err.request) return err.request
        return err    
}