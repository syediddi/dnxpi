$(function () {
    var errorEventsGrid;

    var ioChart;
    var cpuChart;
    var ioReadTimeline = new TimeSeries();
    var ioWriteTimeline = new TimeSeries();
    var cpuTimeline = new TimeSeries();

    // format the byte size to more approapriate values
    function byteSizeFormatter(bytesInput) {
        var sizeKB = (bytesInput / 1024);
        if (sizeKB > 1024) {
            var sizeMB = sizeKB / 1024;
            if (sizeMB > 1024) {
                return (sizeMB / 1024).toFixed(1) + " GB";
            }
            else {
                return sizeMB.toFixed(1) + " MB";
            }
        }
        else {
            return sizeKB.toFixed(1) + " KB";
        }
    };

    function initializeIOChart() {

        var cpuChartOptions = {
            minValue: 0,
            maxValue: 100,
            interpolation : 'linear'
        }

        var ioChartOptions = {
            interpolation: 'linear'
        }

        ioChart = new SmoothieChart(ioChartOptions);
        ioChart.streamTo(document.getElementById("IOChartCanvas"), 1000);

        ioChart.addTimeSeries(ioReadTimeline,
            { strokeStyle: 'rgb(0, 255, 0)', fillStyle: 'rgba(0, 255, 0, 0.4)', lineWidth: 3 });
        ioChart.addTimeSeries(ioWriteTimeline,
          { strokeStyle: 'rgb(255, 0, 0)', fillStyle: 'rgba(255, 0, 0, 0.3)', lineWidth: 3 });

        cpuChart = new SmoothieChart(cpuChartOptions);
        cpuChart.streamTo(document.getElementById("cpuChart"), 1000);
        cpuChart.addTimeSeries(cpuTimeline);

        $('#IOReadSpeed').attr({ style: "color:green"});
        $('#IOWriteSpeed').attr({ style: "color:red"});
    }


    initializeIOChart();

    var websocketProtocol = (document.location.protocol === 'https:' ? 'wss://' : 'ws://');
    //var host = websocketProtocol + window.location.host + '/api/resourcemanager/systemperf';
    var host = 'ws://minwinpc:8080/api/resourcemanager/systemperf';
    var socket = new WebSocket(host);

    socket.onmessage = function (messageEvent) {
        var data = JSON.parse(messageEvent.data);
        showPerfData(data);
    }

    socket.onerror = function (errorEvent) {
        $('#perfConnectionStatus').html('<p class="warning">Error communicating with device!</p>');
    };

    socket.onclose = function (closeEvent) {
        $('#perfConnectionStatus').html('<p class="warning">Connection to device closed!</p>');
    };
    
    function showPerfData(data) {
        var currentChartTime = new Date();
        var readSpeed
        ioReadTimeline.append(currentChartTime, data['IOReadSpeed'] / (1024 * 1024));
        ioWriteTimeline.append(currentChartTime, data['IOWriteSpeed'] / (1024 * 1024));
        $('#IOReadSpeed').html('Read Speed: ' + byteSizeFormatter(data['IOReadSpeed']));
        $('#IOWriteSpeed').html('Write Speed: ' + byteSizeFormatter(data['IOWriteSpeed']));

        cpuTimeline.append(currentChartTime, data['CpuLoad']);
        $('#CpuUtilization').html('CPU utilization: ' + data['CpuLoad'] + '%');

        var pageSize = data['PageSize'];
        var inUseMemory = (data['TotalPages'] - data['AvailablePages']) * pageSize;
        $('#TotalMemory').html('Total: ' + byteSizeFormatter(data['TotalPages'] * pageSize));
        $('#InUseMemory').html('In use: ' + byteSizeFormatter(inUseMemory));
        $('#AvailableMemory').html('Available: ' + byteSizeFormatter(data['AvailablePages'] * pageSize));
        $('#CommitedMemory').html('Commited: ' + byteSizeFormatter(data['CommittedPages'] * pageSize));
        $('#PagedPool').html('Paged: ' + byteSizeFormatter(data['PagedPoolPages'] * pageSize));
        $('#NonPagedPool').html('Non-paged: ' + byteSizeFormatter(data['NonPagedPoolPages'] * pageSize));
    }
});