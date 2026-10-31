import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

import 'pages/curves_page.dart';
import 'pages/implicit_page.dart';
import 'pages/stagger_page.dart';
import 'pages/transitions_page.dart';

void main() => runApp(const AnimationLab());

class AnimationLab extends StatelessWidget {
  const AnimationLab({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Animation lab',
      debugShowCheckedModeBanner: false,
      theme: demoTheme(),
      home: DemoShell(
        title: 'Animation lab',
        pages: [
          DemoPage(
            label: 'Curves',
            icon: Icons.show_chart,
            builder: (_) => const CurvesPage(),
          ),
          DemoPage(
            label: 'Implicit',
            icon: Icons.tune,
            builder: (_) => const ImplicitPage(),
          ),
          DemoPage(
            label: 'Transitions',
            icon: Icons.layers_outlined,
            builder: (_) => const TransitionsPage(),
          ),
          DemoPage(
            label: 'Stagger',
            icon: Icons.view_list_outlined,
            builder: (_) => const StaggerPage(),
          ),
        ],
      ),
    );
  }
}
