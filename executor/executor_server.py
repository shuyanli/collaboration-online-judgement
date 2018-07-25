import json
from flask import Flask
app = Flask(__name__) #__foo__: this is just a convention, a way for the Python system to use names that won't conflict with user names.

from flask import jsonify
from flask import request
import executor_utils as eu

@app.route('/build_and_run', methods = ['POST']) #decorator. The following function will be called when we go to path /build_and_run
def build_and_run():
	data = request.get_json()
	if 'code' not in data or 'lang' not in data:
		return 'You should provide "code" or "data"'

	code = data['code']
	lang = data['lang']

	print("API got called with code : %s and language : %s" %(code, data))
	result = eu.build_and_run(code, lang)
	return jsonify(result)

#on the command line. After setting up the special variables, it will execute the import statement and load those modules.
#It will then evaluate the def block, creating a function object and creating a variable called myfunction that points to the function object.
#It will then read the if statement and see that __name__ does equal "__main__", so it will execute the block shown there.

#One reason for doing this is that sometimes you write a module (a .py file) where it can be executed directly.
#Alternatively, it can also be imported and used in another module. By doing the main check,
#you can have that code only execute when you want to run the module as a program and not have it execute when someone just wants to import your module and call your functions themselves.
if __name__ == '__main__':
	eu.load_image()
	app.run(debug = True) #auto-build in python
