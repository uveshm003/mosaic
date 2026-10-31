import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'src/activity.dart';
import 'src/code_page.dart';
import 'src/visualiser_page.dart';

void main() => runApp(StateVisualiser(activity: Activity()));

class StateVisualiser extends StatelessWidget {
  const StateVisualiser({super.key, required this.activity});

  final Activity activity;

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      observers: [ActivityObserver(activity)],
      child: MaterialApp(
        title: 'State visualiser',
        debugShowCheckedModeBanner: false,
        theme: demoTheme(),
        home: DemoShell(
          title: 'State visualiser',
          pages: [
            DemoPage(
              label: 'Visualiser',
              icon: Icons.account_tree_outlined,
              builder: (_) => VisualiserPage(activity: activity),
            ),
            DemoPage(
              label: 'Code',
              icon: Icons.code,
              builder: (_) => const CodePage(),
            ),
          ],
        ),
      ),
    );
  }
}
