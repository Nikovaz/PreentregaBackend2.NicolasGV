class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email; // Include email
        this.role = user.role;
        this.cart = user.cart;
        // No incluimos password ni información sensible
    }

    static fromUser(user) {
        return new UserDTO(user);
    }
}

export default UserDTO;