/**
 * This is the interface for a user that has been enrolled into a game.
 */
export default interface EnrolledUser {
    email: string,
    name: string,
    sortId: number,
    eliminated: boolean
}