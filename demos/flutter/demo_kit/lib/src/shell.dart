import 'package:flutter/material.dart';

import 'theme.dart';

/// One screen of a demo, listed in its navigation.
class DemoPage {
  const DemoPage({
    required this.label,
    required this.icon,
    required this.builder,
  });

  final String label;
  final IconData icon;
  final WidgetBuilder builder;
}

/// A demo's frame: a title bar, then a navigation bar on narrow screens or a
/// rail on wide ones, the way a real adaptive Flutter app switches.
class DemoShell extends StatefulWidget {
  const DemoShell({super.key, required this.title, required this.pages});

  final String title;
  final List<DemoPage> pages;

  /// Wider than this, the navigation moves to a side rail.
  static const railBreakpoint = 720.0;

  @override
  State<DemoShell> createState() => _DemoShellState();
}

class _DemoShellState extends State<DemoShell> {
  var _index = 0;

  void _select(int index) => setState(() => _index = index);

  @override
  Widget build(BuildContext context) {
    final wide = MediaQuery.sizeOf(context).width >= DemoShell.railBreakpoint;
    final page = KeyedSubtree(
      key: ValueKey(_index),
      child: widget.pages[_index].builder(context),
    );
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: DemoColors.background,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1),
        ),
      ),
      body: wide
          ? Row(
              children: [
                NavigationRail(
                  selectedIndex: _index,
                  onDestinationSelected: _select,
                  labelType: NavigationRailLabelType.all,
                  backgroundColor: DemoColors.background,
                  destinations: [
                    for (final p in widget.pages)
                      NavigationRailDestination(
                        icon: Icon(p.icon),
                        label: Text(p.label),
                      ),
                  ],
                ),
                const VerticalDivider(width: 1),
                Expanded(child: page),
              ],
            )
          : page,
      bottomNavigationBar: wide
          ? null
          : NavigationBar(
              selectedIndex: _index,
              onDestinationSelected: _select,
              backgroundColor: DemoColors.surface,
              destinations: [
                for (final p in widget.pages)
                  NavigationDestination(icon: Icon(p.icon), label: p.label),
              ],
            ),
    );
  }
}
