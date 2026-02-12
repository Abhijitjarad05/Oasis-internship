from flask import Flask, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "secret123"

users = {}

@app.route("/")
def home():
    return """
    <h2>Welcome</h2>
    <a href='/register'>Register</a><br>
    <a href='/login'>Login</a>
    """

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        if username in users:
            return "User already exists!"
        
        users[username] = password
        return redirect(url_for("login"))

    return """
    <h2>Register</h2>
    <form method="post">
        Username: <input name="username"><br>
        Password: <input type="password" name="password"><br>
        <button>Register</button>
    </form>
    """

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        if users.get(username) == password:
            session["user"] = username
            return redirect(url_for("dashboard"))
        else:
            return "Invalid credentials!"

    return """
    <h2>Login</h2>
    <form method="post">
        Username: <input name="username"><br>
        Password: <input type="password" name="password"><br>
        <button>Login</button>
    </form>
    """

@app.route("/dashboard")
def dashboard():
    if "user" in session:
        return f"""
        <h2>Dashboard</h2>
        Welcome {session['user']}!<br>
        <a href='/logout'>Logout</a>
        """
    return redirect(url_for("login"))

@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(debug=True)
