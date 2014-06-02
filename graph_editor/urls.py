__author__ = 'user'

from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('',
    url(r'^$', 'graph_editor.views.index', name="views-index"),
    url(r'^configData', 'graph_editor.views.configData', name="views-config-data"),
    url(r'^getGraphData', 'graph_editor.views.getGraphData', name="views-graph-data"),
    url(r'^getSearchWidget', 'graph_editor.views.getSearchWidget', name="views-search-widget"),
    url(r'^addInstance/', 'graph_editor.views.addInstance', name="views-add-inst"),
    url(r'^addRelation/', 'graph_editor.views.addRelation', name="views-add-rel"),
    url(r'^addBackground/', 'graph_editor.views.addBackground', name="views-add-bg"),
    url(r'^addFragment/', 'graph_editor.views.addFragment', name="views-add-frag"),
    url(r'^saveNode/', 'graph_editor.views.saveNode', name="views-save-node"),
    url(r'^saveBg/', 'graph_editor.views.saveBg', name="views-save-bg"),
    url(r'^saveRelation/', 'graph_editor.views.saveRelation', name="views-save-rel"),
    url(r'^saveGraph/', 'graph_editor.views.saveGraph', name="views-save-graph"),
    url(r'^getObjAttributes/(?P<cid>\d+)/(?P<id>\d+)$', 'graph_editor.views.getObjAttributes', name="views-object-attributes"),
    url(r'^getRelAttributes/(?P<cid>\d+)/(?P<id>\d+)$', 'graph_editor.views.getRelAttributes', name="views-rel-attributes"),
    url(r'^deleteNode/(?P<cid>\d+)/(?P<id>\d+)$', 'graph_editor.views.deleteNode', name="views-delete-node"),
    url(r'^deleteRelation/(?P<cid>\d+)/(?P<id>\d+)$', 'graph_editor.views.deleteRelation', name="views-delete-rel"),
    url(r'^deleteBg/(?P<id>\d+)$', 'graph_editor.views.deleteBg', name="views-delete-bg"),
)