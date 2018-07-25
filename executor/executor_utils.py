#这个文件就是executor_server的service
import os
import docker
import shutil
import uuid

from docker.errors import APIError
from docker.errors import ContainerError
from docker.errors import ImageNotFound

CURRENT_DIR = os.path.dirname(os.path.relpath(__file__)) #__file__ here is executor_utils
IMAGE_NAME = 'shuyanli/cs503'

client = docker.from_env() #To talk to a Docker daemon, you first need to instantiate a client. You can use from_env() to connect using the default socket or the configuration in your environmen

# store the code in tmp folder
TEMP_BUILD_DIR = "%s/tmp/" % CURRENT_DIR
# latest is the latest version of docker image
CONTAINER_NAME = "%s:latest" % IMAGE_NAME

SOURCE_FILE_NAMES = {
	"java": "Example.java",
	"python": "example.py"
}
BINARY_NAMES = {
	"java": "Example",
	"python": "example.py"
}

BUILD_COMMANDS = {
    "java": "javac",
    "python": "python3"
}
EXECUTE_COMMANDS = {
    "java": "java",
    "python": "python3"
}


def load_image():
    try:
        client.images.get(IMAGE_NAME) #尝试获得本地image
        print ("image exist locally")
    except ImageNotFound:
        print("didnt found image from local, pulling from hub")
        client.image.pull(IMAGE_NAME)
    except APIError:
        print("Cannot connect to docker")
        return

def make_dir(dir):
    try:
        os.mkdir(dir)
    except OSError:
        print("cannot create direcotry")


def build_and_run (code, lang):
	result = {
		'build' : None,
		'run' : None,
		'error' : None
	}
	source_file_parent_dir_name = uuid.uuid4() #generate random uuid for each user in order to seperate different users

	#host:发起执行请求的操作系统, linux/mac OS 这一边, guest:实际执行代码的地方, docker里面, 分别给他们两个路径来保存文件
	source_file_host_dir = "%s/%s" %(TEMP_BUILD_DIR, source_file_parent_dir_name)
	source_file_guest_dir = "/test/%s" % (source_file_parent_dir_name)
	make_dir(source_file_host_dir)

	#open the file(if no such file, create one with 'w' (writable))
	#then save the code in this file
	with open("%s/%s" % (source_file_host_dir, SOURCE_FILE_NAMES[lang]), 'w') as source_file:
		source_file.write(code)

	# try to build and catch err
	try:
		client.containers.run (
			image = IMAGE_NAME,
			#for example $javac example.java to build java document
			command = "%s %s" %(BUILD_COMMANDS[lang], SOURCE_FILE_NAMES[lang]),

			# bind the host dir and guest dir, 'rw': read and write
			# means we have read and write permission of guest dir
			#用volumes就使得host和guest共享文件, 另外一个例子,在windows上装linux, 这两个host(win和guess(linux)需要互相共享文件,则就要使用这个volumes
			#两个操作系统是独立的,中间隔着堵墙, 用volumes实现互相共享(docker也可以想象成一个广义的"虚拟机")
			#文件存在了host里面,但是要在guest里面运行,需要这个共享的功能
			volumes = {source_file_host_dir: {'bind': source_file_guest_dir, 'mode':'rw'}},
			working_dir = source_file_guest_dir
		)
		print ("resource built succesfully")
		result['build'] = 'ok'

		#when the container didn't work
	except ContainerError as e:
		result['build'] = str(e.stderr, 'utf-8')

		#removd host dir
		shutil.rmtree(source_file_host_dir)
		return result

	# try to execute and catch error
	try:
		log = client.containers.run (
			image = IMAGE_NAME,
			command = "%s %s" %(EXECUTE_COMMANDS[lang], BINARY_NAMES[lang]),
			volumes = {source_file_host_dir: {'bind': source_file_guest_dir, 'mode':'rw'}},
			working_dir = source_file_guest_dir
		)
		log = str(log, 'utf-8')
		print ("resource run sucessfully: "+log)
		result['run'] = log
	except ContainerError as e:
		result['run'] = str(e.stderr, 'utf-8')
		shuril.rmtree(source_file_host_dir)
		return result

	#after build and run, delete the path to save memory
	shutil.rmtree(source_file_host_dir)
	return result












