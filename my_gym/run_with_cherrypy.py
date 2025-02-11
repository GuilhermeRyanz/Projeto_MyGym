import os
import cherrypy
from django.core.wsgi import get_wsgi_application
from my_gym.wsgi import application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_gym.settings')

application = get_wsgi_application()


class DjangoApp(object):
    @cherrypy.expose
    def default(self, *args, **kwargs):
        return application

cherrypy.config.update({
    'server.socket_host': '0.0.0.0',
    'server.socket_port': 8080,
})

if __name__ == '__main__':
    cherrypy.tree.graft(application, '/')
    cherrypy.engine.start()
    cherrypy.engine.block()