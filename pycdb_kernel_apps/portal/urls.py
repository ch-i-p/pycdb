from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^$', 'portal.views.index', name="index"),
    url(r'^write_gexf$', 'portal.views.write_gexf', name="write_gexf"),

    url(r'^widgets/entity_id_ajax$', 'portal.input_widgets.entity_id_selector.AjaxGetSuggestionEntities', name="widget-entity-id-ajax"),
)

