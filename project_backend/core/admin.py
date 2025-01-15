from django.contrib import admin
from . import models


"""
Admin view for Power plan details
"""
@admin.register(models.PowerPlantDetail)
class PowerPlantDetailAdmin(admin.ModelAdmin):
    list_display = ('system_name', 'system_id', 'group', 'country_name', 'latitude', 'longitude', 'azimuth', 'tilt', 'capacity_dc', 'created_at', 'updated_at','user')

"""
Admin view for GIS data
"""
@admin.register(models.GisWeather)
class PowerPlantDetailAdmin(admin.ModelAdmin):
    list_display = ('power_plant', 'date', 'ghi', 'gti', 'pvout', 'created_at', 'updated_at','user')


"""
Group admin view
"""
@admin.register(models.LoggerPlantGroup)
class LoggerPlantGroupAdmin(admin.ModelAdmin):
    list_display = ('group_name', 'created_at', 'updated_at','user')


"""
Admin view for solar power plan power generation
"""

@admin.register(models.LoggerCategory)
class LoggerCategoryAdmin(admin.ModelAdmin):
    list_display = ('logger_name', 'group', 'created_at', 'updated_at','user')

@admin.register(models.LoggerPowerGen)
class LoggerPowerGenAdmin(admin.ModelAdmin):
    list_display = ('logger_name', 'power_gen', 'date','status', 'created_at','updated_at','user')


@admin.register(models.CurtailmentEvent)
class CurtailmentEventAdmin(admin.ModelAdmin):
    list_display = ('plant_id', 'date', 'start_time', 'end_time','status', 'rd', 'created_at', 'updated_at','user')


"""
Admin view for Utilitie detais
"""
@admin.register(models.UtilityPlantId)
class UtilityPlantIdAdmin(admin.ModelAdmin):
    list_display = ('plant_id', 'group', 'created_at', 'updated_at','user')


@admin.register(models.UtilityMonthlyRevenue)
class UtilityMonthlyRevenueAdmin(admin.ModelAdmin):
    list_display = ('plant_id', 'contract_id', 'start_date',
                    'end_date', 'power_capacity_kw', 'sales_days',
                    'sales_electricity_kwh', 'sales_amount_jpy','tax_jpy',  'average_daily_sales_kwh', 
                    'rd','status','updated_at','created_at',  'user')

@admin.register(models.UtilityMonthlyExpense)
class UtilityMonthlyExpenseAdmin(admin.ModelAdmin):
    list_display = ('plant_id',  'used_electricity_kwh',
                    'used_amount_jpy', 'tax_jpy',
                    'rd','status',  'created_at', 'updated_at','user')

@admin.register(models.UtilityDailyProduction)
class UtilityDailyProductionAdmin(admin.ModelAdmin):
    list_display = ('plant_id', 'power_production_kwh', 'production_date',
                    'rd','status',  'created_at', 'updated_at','user')

"""Mail notification admin """
@admin.register(models.MailNotificatione)
class MailNotificationeAdmin(admin.ModelAdmin):
    list_display= ('from_field','to','date','mail_date_time','subject','body','impact_category',
                   'memo','created_at','updated_at','user')


