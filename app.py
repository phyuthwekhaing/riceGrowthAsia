from flask import Flask,render_template
app = Flask(__name__)

@app.route('/') #define the api route
def home():
    #return "Welcome to my home page"
    return render_template("index.html")

@app.route('/users/<int:userid>', methods=['GET'])
def getUsers(userid):
    msg="View Users Data Page with userid "+str(userid)
    return msg


if __name__ == '__main__':
    app.run()