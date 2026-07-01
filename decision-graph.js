'use strict';

/**
 * SynapseIQ — Decision Graph Engine
 * Interactive SVG graph visualizing business entity relationships.
 */

class DecisionGraph {
  constructor(containerId, callbacks) {
    callbacks = callbacks || {};
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.callbacks = callbacks;
    this.activeNodeId = null;
    this.svg = null;
    this.edgeGroup = null;
    this.nodeGroup = null;
    this.tooltipEl = null;
    this._hoverTimer = null;

    this.VW = 820;
    this.VH = 440;
    this.CX = 410;
    this.CY = 220;
    this.ORBIT = 158;
    this.R_CENTER = 40;
    this.R_NODE = 28;

    this._data = this._buildData();
    this._computeLayout();
    this._build();
  }

  _buildData() {
    return {
      nodes: [
        {
          id: 'health', label: 'Business\nHealth', isCenter: true,
          metric: '74 / 100', trend: 'stable', accent: '#84A98C',
          description: 'Composite AI score aggregating all business function signals in real-time.',
          drivenBy: ['Revenue', 'Profit', 'Customer Satisfaction'],
          signals: ['Composite Score', 'Overall Health Index'],
          questions: [
            'What is my overall business health?',
            'Where do I need to focus most?',
            'What decisions are pending executive resolution?'
          ]
        },
        {
          id: 'revenue', label: 'Revenue', angle: 270,
          metric: 'up 18%', trend: 'up', accent: '#84A98C',
          description: 'Revenue growth driven by enterprise renewals and South Region expansion.',
          drivenBy: ['Marketing', 'Enterprise Customers', 'South Region'],
          signals: ['Revenue Trend', 'Quarterly Performance'],
          questions: [
            'Why did revenue increase?',
            'Which segment drives most revenue?',
            'Predict next quarter revenue.'
          ]
        },
        {
          id: 'profit', label: 'Profit', angle: 321,
          metric: 'up 12%', trend: 'up', accent: '#84A98C',
          description: 'Margins stable. Fixed freight caps offset spot rate volatility.',
          drivenBy: ['Revenue', 'Operations Efficiency', 'Cost Controls'],
          signals: ['Profit Margins', 'Cost Analysis'],
          questions: [
            'How can I improve profit margins?',
            'What risks threaten profit?',
            'Summarize this dataset.'
          ]
        },
        {
          id: 'customers', label: 'Customers', angle: 13,
          metric: 'up 8%', trend: 'up', accent: '#84A98C',
          description: '93% renewal rate. Enterprise accounts growing in EU and North America.',
          drivenBy: ['Marketing', 'Product Quality', 'Customer Success'],
          signals: ['Customer Growth', 'Retention Rate'],
          questions: [
            'Which region needs attention?',
            'What is driving customer churn?',
            'Generate an action plan for customer growth.'
          ]
        },
        {
          id: 'satisfaction', label: 'Customer\nSatisfaction', angle: 64,
          metric: '91 NPS', trend: 'stable', accent: '#A3B18A',
          description: 'NPS at 91. Premium support tiers maintain high satisfaction enterprise-wide.',
          drivenBy: ['Support Response Time', 'Product Quality', 'Onboarding'],
          signals: ['NPS Trend', 'Support Metrics'],
          questions: [
            'What affects customer satisfaction?',
            'Summarize NPS trends.',
            'How do I improve support response time?'
          ]
        },
        {
          id: 'operations', label: 'Operations', angle: 116,
          metric: 'down 32d lag', trend: 'down', accent: '#E07A5F',
          description: 'Transit latencies up 22%. Vietnam/Singapore port backlogs creating upstream pressure.',
          drivenBy: ['Logistics Partners', 'Supplier Risk', 'Transit Delays'],
          signals: ['Transit Latency', 'Supplier Risk Index'],
          questions: [
            'Why is operations lagging?',
            'Which region needs attention?',
            'Generate an operations action plan.'
          ]
        },
        {
          id: 'inventory', label: 'Inventory', angle: 167,
          metric: '72% cap', trend: 'stable', accent: '#A3B18A',
          description: 'Stuttgart safety buffers at 72% capacity. Adequate cushion against delays.',
          drivenBy: ['Operations', 'Demand Forecasting', 'Safety Buffers'],
          signals: ['Inventory Utilization', 'Safety Buffer'],
          questions: [
            'Is inventory sufficient?',
            'Predict inventory needs next quarter.',
            'What is the inventory risk?'
          ]
        },
        {
          id: 'marketing', label: 'Marketing', angle: 218,
          metric: 'down 8% CAC', trend: 'up', accent: '#84A98C',
          description: 'CAC down 8%. Enterprise acquisition programs outperforming targets.',
          drivenBy: ['Campaign Performance', 'Brand Strength', 'Content ROI'],
          signals: ['CAC Trend', 'Campaign Performance'],
          questions: [
            'Which marketing channel performs best?',
            'Why did revenue decline?',
            'Optimize marketing spend allocation.'
          ]
        }
      ],
      edges: [
        { from: 'health', to: 'revenue',      weight: 'strong' },
        { from: 'health', to: 'profit',       weight: 'strong' },
        { from: 'health', to: 'customers',    weight: 'strong' },
        { from: 'health', to: 'satisfaction', weight: 'medium' },
        { from: 'health', to: 'operations',   weight: 'medium', negative: true },
        { from: 'health', to: 'inventory',    weight: 'weak' },
        { from: 'health', to: 'marketing',    weight: 'medium' },
        { from: 'marketing',  to: 'revenue',      weight: 'strong' },
        { from: 'marketing',  to: 'customers',    weight: 'medium' },
        { from: 'revenue',    to: 'profit',       weight: 'strong' },
        { from: 'customers',  to: 'satisfaction', weight: 'strong' },
        { from: 'operations', to: 'profit',       weight: 'medium', negative: true },
        { from: 'inventory',  to: 'operations',   weight: 'medium' }
      ]
    };
  }

  _computeLayout() {
    this._data.nodes.forEach(function(n) {
      if (n.isCenter) {
        n.x = 410; n.y = 220;
      } else {
        var rad = (n.angle * Math.PI) / 180;
        n.x = 410 + 158 * Math.cos(rad);
        n.y = 220 + 158 * Math.sin(rad);
      }
    });
  }

  _svg(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  _build() {
    this.container.style.position = 'relative';

    this.svg = this._svg('svg');
    this.svg.setAttribute('viewBox', '0 0 820 440');
    this.svg.setAttribute('class', 'dg-svg');

    var defs = this._svg('defs');
    defs.appendChild(this._glowFilter('dg-glow-sage', '#84A98C', 6));
    defs.appendChild(this._glowFilter('dg-glow-terra', '#E07A5F', 6));
    defs.appendChild(this._glowFilter('dg-glow-olive', '#A3B18A', 5));
    this.svg.appendChild(defs);

    this.edgeGroup = this._svg('g');
    this.edgeGroup.setAttribute('class', 'dg-edge-group');

    this.nodeGroup = this._svg('g');
    this.nodeGroup.setAttribute('class', 'dg-node-group');

    this.svg.appendChild(this.edgeGroup);
    this.svg.appendChild(this.nodeGroup);
    this.container.appendChild(this.svg);

    this._buildTooltip();
    this._renderEdges();
    this._renderNodes();
  }

  _glowFilter(id, color, stdDev) {
    var filter = this._svg('filter');
    filter.setAttribute('id', id);
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    var blur = this._svg('feGaussianBlur');
    blur.setAttribute('in', 'SourceAlpha');
    blur.setAttribute('stdDeviation', stdDev);
    blur.setAttribute('result', 'b');
    var flood = this._svg('feFlood');
    flood.setAttribute('flood-color', color);
    flood.setAttribute('flood-opacity', '0.55');
    flood.setAttribute('result', 'c');
    var comp = this._svg('feComposite');
    comp.setAttribute('in', 'c');
    comp.setAttribute('in2', 'b');
    comp.setAttribute('operator', 'in');
    comp.setAttribute('result', 'g');
    var merge = this._svg('feMerge');
    ['g', 'SourceGraphic'].forEach(function(ref) {
      var mn = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
      mn.setAttribute('in', ref);
      merge.appendChild(mn);
    });
    filter.appendChild(blur);
    filter.appendChild(flood);
    filter.appendChild(comp);
    filter.appendChild(merge);
    return filter;
  }

  _renderEdges() {
    var self = this;
    this._data.edges.forEach(function(edge) {
      var src = self._data.nodes.find(function(n) { return n.id === edge.from; });
      var tgt = self._data.nodes.find(function(n) { return n.id === edge.to; });
      if (!src || !tgt) return;
      var path = self._svg('path');
      path.setAttribute('d', self._edgePath(src, tgt));
      path.setAttribute('class', 'dg-edge');
      path.setAttribute('data-from', edge.from);
      path.setAttribute('data-to', edge.to);
      path.setAttribute('fill', 'none');
      var sw = edge.weight === 'strong' ? '1.5' : edge.weight === 'medium' ? '1.2' : '0.8';
      path.style.stroke = 'rgba(255,255,255,0.09)';
      path.style.strokeWidth = sw;
      path.style.strokeDasharray = '500';
      path.style.strokeDashoffset = '500';
      path.style.opacity = '0';
      path.style.transition = 'stroke 0.3s ease, stroke-width 0.3s ease, opacity 0.3s ease';
      self.edgeGroup.appendChild(path);
      try {
        var len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
      } catch(e) {}
      edge.el = path;
    });
  }

  _edgePath(src, tgt) {
    var isSpoke = src.isCenter || tgt.isCenter;
    if (isSpoke) {
      return 'M ' + src.x + ' ' + src.y + ' L ' + tgt.x + ' ' + tgt.y;
    }
    var mx = (src.x + tgt.x) / 2;
    var my = (src.y + tgt.y) / 2;
    var dx = mx - this.CX;
    var dy = my - this.CY;
    var d = Math.sqrt(dx*dx + dy*dy) || 1;
    var cpx = mx + (dx/d)*22;
    var cpy = my + (dy/d)*22;
    return 'M ' + src.x + ' ' + src.y + ' Q ' + cpx + ' ' + cpy + ' ' + tgt.x + ' ' + tgt.y;
  }

  _renderNodes() {
    var self = this;
    this._data.nodes.forEach(function(node) {
      var r = node.isCenter ? self.R_CENTER : self.R_NODE;
      var g = self._svg('g');
      g.setAttribute('class', 'dg-node' + (node.isCenter ? ' dg-node--center' : ''));
      g.setAttribute('data-id', node.id);
      g.setAttribute('transform', 'translate(' + node.x + ',' + node.y + ')');
      g.setAttribute('tabindex', '0');
      g.style.opacity = '0';
      g.style.cursor = 'pointer';

      var glow = self._svg('circle');
      glow.setAttribute('r', r + 12);
      glow.setAttribute('class', 'dg-node-glow');
      glow.style.fill = 'none';
      glow.style.stroke = node.accent;
      glow.style.strokeWidth = '0';
      glow.style.opacity = '0';
      glow.style.transition = 'stroke-width 0.35s ease, opacity 0.35s ease';

      var circle = self._svg('circle');
      circle.setAttribute('r', r);
      circle.setAttribute('class', 'dg-node-circle');
      circle.style.fill = '#111827';
      circle.style.stroke = node.isCenter ? node.accent : 'rgba(255,255,255,0.18)';
      circle.style.strokeWidth = node.isCenter ? '1.5' : '1';
      circle.style.transition = 'stroke 0.3s ease, stroke-width 0.3s ease, fill 0.3s ease, filter 0.3s ease';

      var label = self._buildLabel(node);

      var metric = self._svg('text');
      metric.setAttribute('class', 'dg-node-metric');
      metric.setAttribute('text-anchor', 'middle');
      metric.setAttribute('y', r + 14);
      metric.style.fill = node.trend === 'down' ? '#E07A5F' : node.trend === 'up' ? '#84A98C' : '#8B949E';
      metric.style.fontSize = '7.5px';
      metric.style.fontWeight = '700';
      metric.style.fontFamily = 'Inter, sans-serif';
      metric.style.letterSpacing = '0.03em';
      metric.style.pointerEvents = 'none';
      metric.style.userSelect = 'none';
      metric.textContent = node.metric;

      g.appendChild(glow);
      g.appendChild(circle);
      g.appendChild(label);
      if (!node.isCenter) g.appendChild(metric);

      g.addEventListener('mouseenter', function(e) { self._onHover(node, e); });
      g.addEventListener('mouseleave', function() { self._onLeave(); });
      g.addEventListener('click', function() { self._onClick(node); });
      g.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); self._onClick(node); }
      });

      self.nodeGroup.appendChild(g);
      node.el = g;
    });
  }

  _buildLabel(node) {
    var self = this;
    var text = self._svg('text');
    text.setAttribute('class', 'dg-node-label');
    text.setAttribute('text-anchor', 'middle');
    text.style.fill = node.isCenter ? '#F0F6FC' : '#C9D1D9';
    text.style.fontSize = node.isCenter ? '8px' : '7px';
    text.style.fontWeight = '700';
    text.style.fontFamily = 'Inter, sans-serif';
    text.style.letterSpacing = '0.07em';
    text.style.textTransform = 'uppercase';
    text.style.pointerEvents = 'none';
    text.style.userSelect = 'none';

    var lines = node.label.split('\n');
    var lineH = 1.15;
    var startY = -((lines.length - 1) * lineH) / 2;
    lines.forEach(function(line, i) {
      var ts = self._svg('tspan');
      ts.setAttribute('x', '0');
      ts.setAttribute('y', (startY + i * lineH) + 'em');
      ts.setAttribute('dominant-baseline', 'middle');
      ts.textContent = line;
      text.appendChild(ts);
    });
    return text;
  }

  animateIn() {
    var self = this;
    var center = this._data.nodes.find(function(n) { return n.isCenter; });
    if (center && center.el) {
      setTimeout(function() {
        center.el.style.transition = 'opacity 0.5s ease';
        center.el.style.opacity = '1';
      }, 100);
    }

    var spokeEdges = this._data.edges.filter(function(e) {
      var src = self._nodeById(e.from);
      var tgt = self._nodeById(e.to);
      return (src && src.isCenter) || (tgt && tgt.isCenter);
    });
    spokeEdges.forEach(function(edge, i) {
      setTimeout(function() {
        if (!edge.el) return;
        edge.el.style.transition = 'stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease';
        edge.el.style.opacity = '1';
        edge.el.style.strokeDashoffset = '0';
      }, 350 + i * 60);
    });

    var outerNodes = this._data.nodes.filter(function(n) { return !n.isCenter; });
    outerNodes.forEach(function(node, i) {
      setTimeout(function() {
        if (!node.el) return;
        node.el.style.transition = 'opacity 0.4s ease';
        node.el.style.opacity = '1';
      }, 700 + i * 90);
    });

    var lateralEdges = this._data.edges.filter(function(e) {
      var src = self._nodeById(e.from);
      var tgt = self._nodeById(e.to);
      return !(src && src.isCenter) && !(tgt && tgt.isCenter);
    });
    lateralEdges.forEach(function(edge, i) {
      setTimeout(function() {
        if (!edge.el) return;
        edge.el.style.transition = 'stroke-dashoffset 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease';
        edge.el.style.opacity = '1';
        edge.el.style.strokeDashoffset = '0';
      }, 1450 + i * 110);
    });
  }

  _onHover(node, e) {
    if (this._hoverTimer) clearTimeout(this._hoverTimer);
    if (this.activeNodeId === node.id) return;
    this.activeNodeId = node.id;

    var connected = this._connectedIds(node.id);

    this._data.nodes.forEach(function(n) {
      if (!n.el) return;
      var circle = n.el.querySelector('.dg-node-circle');
      var glow = n.el.querySelector('.dg-node-glow');
      var isActive = n.id === node.id;
      var isConn = connected.has(n.id);
      if (isActive) {
        n.el.style.opacity = '1';
        circle.style.stroke = n.accent;
        circle.style.strokeWidth = '2';
        circle.style.fill = '#1a2535';
        var fId = n.trend === 'down' ? 'dg-glow-terra' : n.trend === 'up' ? 'dg-glow-sage' : 'dg-glow-olive';
        circle.style.filter = 'url(#' + fId + ')';
        glow.style.strokeWidth = '1.5';
        glow.style.opacity = '0.4';
      } else if (isConn) {
        n.el.style.opacity = '1';
        circle.style.stroke = 'rgba(255,255,255,0.3)';
        circle.style.strokeWidth = '1.2';
        circle.style.fill = '#111827';
        circle.style.filter = 'none';
        glow.style.strokeWidth = '0';
        glow.style.opacity = '0';
      } else {
        n.el.style.opacity = '0.18';
        circle.style.filter = 'none';
        glow.style.strokeWidth = '0';
        glow.style.opacity = '0';
      }
    });

    this._data.edges.forEach(function(edge) {
      if (!edge.el) return;
      var linked = edge.from === node.id || edge.to === node.id;
      if (linked) {
        edge.el.style.stroke = edge.negative ? 'rgba(224,122,95,0.65)' : 'rgba(132,169,140,0.65)';
        edge.el.style.strokeWidth = edge.weight === 'strong' ? '2' : '1.5';
        edge.el.style.opacity = '1';
      } else {
        edge.el.style.stroke = 'rgba(255,255,255,0.04)';
        edge.el.style.strokeWidth = '0.8';
        edge.el.style.opacity = '0.5';
      }
    });

    this._showTooltip(node);
  }

  _onLeave() {
    var self = this;
    this._hoverTimer = setTimeout(function() {
      self._resetVisuals();
      self._hideTooltip();
      self.activeNodeId = null;
    }, 80);
  }

  _onClick(node) {
    this._updateDetailPanel(node);
    if (typeof this.callbacks.onNodeClick === 'function') {
      this.callbacks.onNodeClick(node.id, node);
    }
    this.container.dispatchEvent(new CustomEvent('dg:nodeclick', {
      bubbles: true,
      detail: { nodeId: node.id, node: node }
    }));
  }

  _resetVisuals() {
    this._data.nodes.forEach(function(n) {
      if (!n.el) return;
      var circle = n.el.querySelector('.dg-node-circle');
      var glow = n.el.querySelector('.dg-node-glow');
      n.el.style.opacity = '1';
      circle.style.stroke = n.isCenter ? n.accent : 'rgba(255,255,255,0.18)';
      circle.style.strokeWidth = n.isCenter ? '1.5' : '1';
      circle.style.fill = '#111827';
      circle.style.filter = 'none';
      if (glow) { glow.style.strokeWidth = '0'; glow.style.opacity = '0'; }
    });
    this._data.edges.forEach(function(edge) {
      if (!edge.el) return;
      edge.el.style.stroke = 'rgba(255,255,255,0.09)';
      edge.el.style.strokeWidth = edge.weight === 'strong' ? '1.5' : edge.weight === 'medium' ? '1.2' : '0.8';
      edge.el.style.opacity = '1';
    });
  }

  _buildTooltip() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'dg-tooltip';
    this.container.appendChild(this.tooltipEl);
  }

  _showTooltip(node) {
    var tCls = node.trend === 'down' ? 'dg-tt-metric--down' : node.trend === 'up' ? 'dg-tt-metric--up' : 'dg-tt-metric--stable';
    var drivenHTML = node.drivenBy.map(function(d) { return '<li>' + d + '</li>'; }).join('');
    this.tooltipEl.innerHTML = '<div class="dg-tt-header"><span class="dg-tt-name">' + node.label.replace('\n',' ') + '</span><span class="dg-tt-metric ' + tCls + '">' + node.metric + '</span></div><p class="dg-tt-desc">' + node.description + '</p><div class="dg-tt-driven"><span class="dg-tt-driven-label">Driven by</span><ul>' + drivenHTML + '</ul></div><span class="dg-tt-hint">Click to explore</span>';

    var svgRect = this.svg.getBoundingClientRect();
    var contRect = this.container.getBoundingClientRect();
    var scX = svgRect.width / this.VW;
    var scY = svgRect.height / this.VH;
    var nx = svgRect.left + node.x * scX - contRect.left;
    var ny = svgRect.top + node.y * scY - contRect.top;

    var ttW = 230;
    var ttH = 180;
    var left = nx + 50;
    if (left + ttW > contRect.width - 8) left = nx - ttW - 50;
    left = Math.max(8, left);
    var top = ny - ttH / 2;
    top = Math.max(8, Math.min(top, contRect.height - ttH - 8));

    this.tooltipEl.style.left = left + 'px';
    this.tooltipEl.style.top = top + 'px';
    this.tooltipEl.classList.add('dg-tooltip--visible');
  }

  _hideTooltip() {
    this.tooltipEl.classList.remove('dg-tooltip--visible');
  }

  _updateDetailPanel(node) {
    var panel = document.getElementById('dg-detail-panel');
    if (!panel) return;

    var tCls = node.trend === 'down' ? 'dg-dp-metric--down' : node.trend === 'up' ? 'dg-dp-metric--up' : 'dg-dp-metric--stable';
    var signalsHTML = node.signals.map(function(s) { return '<span class="dg-signal-chip">' + s + '</span>'; }).join('');
    var questionsHTML = node.questions.map(function(q) {
      return '<button class="dg-question-btn" data-q="' + q.replace(/"/g, '&quot;') + '">' + q + '</button>';
    }).join('');

    panel.innerHTML = '<div class="dg-dp-inner"><div class="dg-dp-top"><div><span class="dg-dp-eyebrow">Active Node</span><h3 class="dg-dp-name">' + node.label.replace('\n',' ') + '</h3><p class="dg-dp-desc">' + node.description + '</p></div><span class="dg-dp-badge ' + tCls + '">' + node.metric + '</span></div><div class="dg-dp-cols"><div class="dg-dp-col"><span class="dg-dp-col-label">Related Signals</span><div class="dg-dp-signals">' + signalsHTML + '</div></div><div class="dg-dp-col"><span class="dg-dp-col-label">Ask Decision Copilot</span><div class="dg-dp-questions">' + questionsHTML + '</div></div></div></div>';

    panel.classList.add('dg-detail-panel--visible');

    panel.querySelectorAll('.dg-question-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var q = btn.getAttribute('data-q');
        if (typeof window.synapseRouteToQuestion === 'function') {
          window.synapseRouteToQuestion(q);
        }
      });
    });
  }

  _nodeById(id) {
    return this._data.nodes.find(function(n) { return n.id === id; });
  }

  _connectedIds(nodeId) {
    var ids = new Set([nodeId]);
    this._data.edges.forEach(function(e) {
      if (e.from === nodeId) ids.add(e.to);
      if (e.to === nodeId) ids.add(e.from);
    });
    return ids;
  }

  destroy() {
    if (this._hoverTimer) clearTimeout(this._hoverTimer);
    if (this.tooltipEl && this.container.contains(this.tooltipEl)) this.container.removeChild(this.tooltipEl);
    if (this.svg && this.container.contains(this.svg)) this.container.removeChild(this.svg);
  }
}

window.DecisionGraph = DecisionGraph;
